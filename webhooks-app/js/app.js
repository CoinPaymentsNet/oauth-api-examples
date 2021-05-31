import {ClientIdField} from "./clientIdField/clientIdField.js";
import {WebhooksList} from "./webhooksList/webhooksList.js";
import {CreateWebhook} from "./createWebhook/createWebhook.js";
import {UpdateWebhook} from "./updateWebhook/updateWebhook.js";
import {DeleteWebhook} from "./deleteWebhook/deleteWebhook.js";
import {Login} from "./login/login.js";


/**
 * Main application element, simply registers the web components
 */
const webhooksApp = async () => {

    const request = new CoinPaymentsOauthRequest({
        apiBaseUrl: "https://orion-api.starhermit.com",
        identityBaseUrl: "https://orion-identity.starhermit.com",
        identityClientId: "coinpayments-aphrodite",
        requestConfig: {
            validateStatus: false,
        }
    })

    let blocks = {
        "login-block": Login,
        "client-params-block": ClientIdField,
        "webhooks-list": WebhooksList,
        "create-webhook": CreateWebhook,
        "update-webhook": UpdateWebhook,
        "delete-webhook": DeleteWebhook,

    }

    for (const [block_tag, block_elem] of Object.entries(blocks)) {
        customElements.define(block_tag, block_elem);
        if (document.querySelector(block_tag).setRequest) {
            document.querySelector(block_tag).setRequest(request)
        }
    }

};

document.addEventListener("DOMContentLoaded", webhooksApp);
