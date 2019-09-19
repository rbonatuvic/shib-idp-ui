pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
  }
  stages {
    stage('Build') {
      steps {
        sh './gradlew clean build'
      }
      post {
        always {
          junit 'backend/build/test-results/**/*.xml'
          jacoco execPattern: '**/build/jacoco/test.exec'
        }
      }
    }

# Commented out, for the time being, per SHIBUI-1505
#    stage('Run Selenium tests') {
#      when {
#        expression {
#          return (GIT_BRANCH.startsWith('PR') || GIT_BRANCH.endsWith('-QA'))
#        }
#      }
#      steps {
#        sh '''
#        ./gradlew integrationTest -Dselenium.host=jenkins
#        '''
#      }
#      post {
#        always {
#          junit 'backend/build/test-results/integrationTest/**/*.xml'
#        }
#      }
#    }

    stage('Build Docker images') {
      when {
        expression {
          return GIT_BRANCH in ['master']
        }
      }
      steps {
        sh '''./gradlew docker -x test
        '''
      }
    }

    stage('Deploy') {
      when {
        expression {
          return GIT_BRANCH in ['master']
        }
      }
      steps {
        sh '''
        docker stop shibui || true && docker rm shibui || true
        docker run -d --restart always --name shibui -p 8080:8080 -v /etc/shibui:/conf -v /etc/shibui/application.yml:/application.yml -m 4GB --memory-swap=4GB unicon/shibui-pac4j:latest /usr/bin/java -Xmx3G -jar app.jar
        '''
      }
    }
  }
  post {
    failure {
      step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: emailextrecipients([[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']])])
    }
    success {
      emailext body: '''${SCRIPT, template="groovy-text.template"}''', recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], subject: '[SHIBUI] Build Success'
    }
    always {
      cleanWs()
    }
  }
}
