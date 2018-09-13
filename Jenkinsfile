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
        }
      }
    }
  }
}