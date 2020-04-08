const execSync = require('child_process').execSync;
let config_tomcat = document.querySelector('#config-tomcat').value;
let path_openpay = document.querySelector('#config-openpay').value + '/';

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
    if (document.querySelector('#gateways').checked) {
        executeMavenCleanAndInstall('gateways', (output) => {
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

    if (document.querySelector('#service').checked) {
        executeMavenCleanAndPackage('mx.openpay.services', (output) => {
            console.log(output);
        });
        copyWarToWebapps('mx.openpay.services', 'Services.war', (output) => {
            console.log('Copiado');
        });
    }

    if (document.querySelector('#manager').checked) {
        executeMavenCleanAndPackage('mx.openpay.manager', (output) => {
            console.log(output);
        });
        copyWarToWebapps('mx.openpay.manager', 'openpay-manager.war', (output) => {
            console.log('Copiado');
        });
    }
})

document.querySelector('#startup').addEventListener('click', async () => {
    startupTomcatServer(config_tomcat, (output) => {
        console.log('Tomcat server is running');
    });
});

document.querySelector('#shutdown').addEventListener('click', async () => {
    shutdownTomcatServer(config_tomcat, (output) => {
        console.log('Tomcat server is shutdown');
    });
});

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
    var command = 'cp ' + path_openpay + project + '/target/' + war + ' ' + config_tomcat + '/webapps/';
    console.log(command);
    execSync(command, {stdio: 'inherit'});
}

function startupTomcatServer(server_path){
    var command = 'sh ' + server_path + '/bin/startup.sh';
    execSync(command, {stdio: 'inherit'});
}

function shutdownTomcatServer(server_path){
    var command = "ps -ef | grep tomcat | grep -v grep | awk '{print $2}' | xargs kill ";
    execSync(command, {stdio: 'inherit'});
}