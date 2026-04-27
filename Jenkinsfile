String registryEndpoint = 'registry.registry-01.dmxhbjIwbG9jYWwK.bswdi.co.uk'

def branch = env.BRANCH_NAME.replaceAll("/", "_")
def image
def versionName
String imageName = "bswdi/daisys-form-website:${branch}-${env.BUILD_ID}"

pipeline {
  agent {
    label 'docker'
  }

  environment {
    DOCKER_BUILDKIT = '1'
    VAULT_ADDR = 'https://vault.YWRtaW51cmxz.bswdi.co.uk'
  }

  stages {
    stage('Prepare') {
      steps {
        ciSkip action: 'check'
        script {
          def versionNamePrefix = "${env.BRANCH_NAME}-"
          versionName = "${versionNamePrefix.replace('/', '--')}${env.BUILD_ID}"
        }
      }
    }
    stage('Fetch Secrets') {
      steps {
        withCredentials([string(credentialsId: 'vault-ansible', variable: 'VAULT_TOKEN')]) {
          script {
            def response = httpRequest(
              customHeaders: [
                [maskValue: true, name: 'X-Vault-Token', value: env.VAULT_TOKEN]
              ],
              httpMode: 'GET',
              url: "${VAULT_ADDR}/v1/kv/data/daisys-form-website-dev",
              validResponseCodes: '200'
            )

            def json = readJSON text: response.content
            env.DATABASE_URL = json.data.data['database-url']
          }
        }
      }
    }

    stage('Build image') {
      steps {
        script {
          def GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H' | head -c 7", returnStdout: true)
          docker.withRegistry('https://' + registryEndpoint) {
            image = docker.build(imageName, "--build-arg DFW_VERSION_ARG=${env.TAG_NAME ?: versionName} \
                --build-arg DFW_GIT_HASH=${GIT_COMMIT_HASH} \
                --secret id=database_url,env=DATABASE_URL ."
            )
          }
        }
      }
    }

    stage('Push image to registry') {
      steps {
        script {
          docker.withRegistry('https://' + registryEndpoint) {
            image.push()
            if (env.BRANCH_IS_PRIMARY) {
              image.push('latest')
            }
          }
        }
      }
    }

    stage('Deploy') {
      stages {
        stage('Development') {
          when {
            expression { env.BRANCH_IS_PRIMARY }
          }
          steps {
            build(job: 'Deploy Nomad Job', parameters: [
              string(name: 'JOB_FILE', value: 'daisys-form-website-dev.nomad'),
              text(name: 'TAG_REPLACEMENTS', value: "${registryEndpoint}/${imageName}")
            ])
          }
        }

        stage('Production') {
          when {
            // Checking if it is semantic version release.
            expression { return env.TAG_NAME ==~ /v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/ }
          }
          steps {
            build(job: 'Deploy Nomad Job', parameters: [
              string(name: 'JOB_FILE', value: 'daisys-form-website-prod.nomad'),
              text(name: 'TAG_REPLACEMENTS', value: "${registryEndpoint}/${imageName}")
            ])
          }
        }
      }
    }
  }
}
