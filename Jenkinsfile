pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        // 请确保代码仓库内有 .npmrc 文件
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [
            [url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]
          ]
        ])
      }
    }
    stage('构建') {
      steps {
        sh 'cd eform-web'
        sh 'npm install'
        sh 'npm run build:prod'
        echo '构建完成'
        sh 'ls dist'
      }
  }
}
