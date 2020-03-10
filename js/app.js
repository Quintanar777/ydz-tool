const execSync = require('child_process').execSync;
let config_tomcat = document.querySelector('#config-tomcat').value;
let path_openpay = document.querySelector('#config-openpay').value;

document.querySelector('#run').addEventListener('click', async () => {

    //librerias
    if (document.querySelector('#data').checked) {
        executeMavenCleanAndInstall('mx.openpay.data', (output) => {
            console.log(output);
        });
    }
    if (document.querySelector('#commons').checked) {
        executeMavenCleanAndInstall('mx.openpay.commons', (output) => {
            console.log(output);
        });
    }
    if (document.querySelector('#business').checked) {
        executeMavenCleanAndInstall('mx.openpay.business', (output) => {
            console.log(output);
        });
    }
    if (document.querySelector('#vault').checked) {
        executeMavenCleanAndInstall('mx.openpay.vault.client', (output) => {
            console.log(output);
        });
    }



    //aplicaciones
    if (document.querySelector('#dashboard').checked) {
        executeMavenCleanAndPackage('mx.openpay.dashboard', (output) => {
            console.log(output);
        });
        copyWarToWebapps('mx.openpay.dashboard', 'dashboard.war', (output) => {
            console.log('Copiado');
        });
    }
})


function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

function executeMavenCleanAndInstall(project) {
    console.log('Install ' + project);
    var command = 'maven clean install -f ' + path_openpay + project + '/pom.xml' + ' -DskipTests';
    console.log(command);
    execSync(command, {stdio: 'inherit'});

}

function executeMavenCleanAndPackage(project) {
    console.log('Package ' + project);
    var command = 'maven clean package -f ' + path_openpay + project + '/pom.xml' + ' -DskipTests';
    console.log(command);
    execSync(command, {stdio: 'inherit'});
}

function copyWarToWebapps(project, war) {
    var command = 'cp ' + path_openpay + project + '/target/' + war + ' ' + config_tomcat;
    console.log(command);
    execSync(command, {stdio: 'inherit'});
}

