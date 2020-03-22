pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
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
        dir(path: './eform-web') {
          sh 'yarn config set registry https://registry.npm.taobao.org'
          sh 'yarn'
          sh 'yarn build:prod'
          sh 'ls dist'
        }
      }
    }
    stage('部署') {
        steps {
            script {
                def remoteConfig = [:]
                remoteConfig.name = "qcloud-amber"
                remoteConfig.host = "${env.REMOTE_HOST}"
                remoteConfig.allowAnyHosts = true
                remoteConfig.port = 12450
                remoteConfig.user = "amber"
                // 使用 SCP 作为文件传输
                remoteConfig.fileTransfer = "SCP"
                withCredentials([sshUserPrivateKey(
                    credentialsId: "${env.QCLOUD_CREDENTIALS_ID}", 
                    keyFileVariable: "privateKeyFilePath"
                )]) {
                    // SSH 登陆用户名
                    remoteConfig.user = "${env.REMOTE_USER_NAME}"
                    // SSH 私钥文件地址
                    remoteConfig.identityFile = privateKeyFilePath
            
                    stage("将构建完成的文件部署到服务器") {
                        // 将本地的文件复制到远端
                        sshPut(
                            remote: remoteConfig,
                            // 本地文件或文件夹
                            from: './eform-web/dist',
                            // 远端文件或文件夹
                            into: '/home/amber/eform/'
                        )
                    }
                }
            }
        }
    }
  }
}