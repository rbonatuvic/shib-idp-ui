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
        docker run -d --restart always --name shibui -p 8080:8080 -v /etc/shibui/application.properties:/application.properties -m 3GB --memory-swap=3GB unicon/shibui:latest
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
  }
}