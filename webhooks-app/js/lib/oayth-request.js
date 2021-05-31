class CoinPaymentsOauthRequest {

    apiBaseUrl = "https://api.coinpayments.net"
    identityBaseUrl = "https://identity.coinpayments.net"

    requestConfig = {}

    currentHref = location.protocol + "//" +
        location.host +
        location.pathname +
        (location.search ? location.search : "")

    hashed = false;

    constructor(config) {
        let client_config = {
            apiBaseUrl: config.apiBaseUrl || this.apiBaseUrl,
            identityBaseUrl: config.identityBaseUrl || this.identityBaseUrl,
            identityClientId: config.identityClientId || "coinpayments-aphrodite",
            identitySignInRedirectUri: config.identitySignInRedirectUri || this.currentHref,
            post_logout_redirect_uri: config.post_logout_redirect_uri || this.currentHref
        }

        this.requestConfig = config.requestConfig || {};

        this.client = new CoinPayments.CoinPaymentsClient(client_config);

        if (this.currentHref === client_config.identitySignInRedirectUri) {
            this.receiveToken()
        }
    }

    async isLoggedIn() {
        return await this.client.user.getUserSessionInfo().then(info => {
            return info.isSignedIn;
        });
    }

    receiveToken() {
        let hashParams = new URLSearchParams(window.location.hash.substring(1));
        let hashIdToken = hashParams.get("id_token");
        if (hashIdToken) {
            this.hashed = true
            let signInRedirectHref = this.currentHref;
            CoinPayments.CoinPaymentsClient.userSigninRedirectCallback()
                .then((user) => {
                    window.location.href = signInRedirectHref;
                })
        }
    }

    get(url, params = null) {
        if (!this.hashed) {
            if (params) {
                url += "?" + new URLSearchParams(params).toString()
            }
            const mergedConfig = Object.assign(Object.assign({}, this.requestConfig));
            return this.client.orionClient.get(url, mergedConfig);
        }
    }

    post(url, params = null) {
        if (!this.hashed) {
            const mergedConfig = Object.assign(Object.assign({}, this.requestConfig));
            return this.client.orionClient.post(url, params, mergedConfig);
        }
    }

    put(url, params = null) {
        if (!this.hashed) {
            const mergedConfig = Object.assign(Object.assign({}, this.requestConfig));
            return this.client.orionClient.put(url, params, mergedConfig);
        }
    }

    delete(url) {
        if (!this.hashed) {
            const mergedConfig = Object.assign(Object.assign({}, this.requestConfig));
            return this.client.orionClient.delete(url, mergedConfig);
        }
    }

}