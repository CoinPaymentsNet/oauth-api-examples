export class DeleteWebhook extends HTMLElement {
    webhook_button = {"query": "#delete-webhook-button", "target": HTMLElement};
    webhook_id = {"query": "#delete-webhook-id", "target": HTMLElement};
    client_params = {"query": "client-params-block"};

    /**
     * Create a new instance of
     */
    constructor() {
        super();
    }

    async connectedCallback() {
        const response = await fetch("./js/deleteWebhook/deleteWebhook.html");
        this.innerHTML = await response.text();

        this.querySelector(this.webhook_button.query).addEventListener("click", () => this.deleteWebhook());

        this.webhook_id.target = this.querySelector(this.webhook_id.query);
        this.webhook_id.target.addEventListener("keyup", () => this.set_webhook_id());
        this.webhook_id.target.value = sessionStorage.getItem(this.webhook_id.query)
    }

    setRequest(request) {
        this.request = request
    }

    set_webhook_id() {
        sessionStorage.setItem(this.webhook_id.query, this.webhook_id.target.value)
    }

    async deleteWebhook() {
        try {
            let client_id = document.querySelector(this.client_params.query).getClientId()
            let webhook_id = this.webhook_id.target.value;
            await this.request.delete("/api/v1/merchant/clients/" + client_id + "/webhooks/" + webhook_id).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    alert("Webhook " + webhook_id + " successfully deleted!")
                } else {
                    if (response.status >= 400 && response.status < 500) {
                        response.data = JSON.parse(response.data);
                        throw new Error(response.data.detail);
                    }
                    throw new Error(response.statusText);
                }
            })
        } catch (e) {
            alert(e);
        }
    }
}