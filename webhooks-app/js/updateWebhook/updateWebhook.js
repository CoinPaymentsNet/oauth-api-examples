export class UpdateWebhook extends HTMLElement {
    webhook_button = {"query": "#update-webhook-button", "target": HTMLElement};
    webhook_id = {"query": "#update-webhook-id", "target": HTMLElement};
    notifications_url = {"query": "#update-notifications-url", "target": HTMLElement};
    notifications = {"query": ".update-notifications"};
    checked_notifications = {"query": ".update-notifications:checked", values: []};
    client_params = {"query": "client-params-block"};

    /**
     * Create a new instance of
     */
    constructor() {
        super();
    }

    async connectedCallback() {
        const response = await fetch("./js/updateWebhook/updateWebhook.html");
        this.innerHTML = await response.text();

        this.querySelector(this.webhook_button.query).addEventListener("click", () => this.updateWebhook());

        this.webhook_id.target = this.querySelector(this.webhook_id.query)
        this.webhook_id.target.addEventListener("keyup", () => this.set_webhook_id());
        this.webhook_id.target.value = sessionStorage.getItem(this.webhook_id.query)

        this.notifications_url.target = this.querySelector(this.notifications_url.query)
        this.notifications_url.target.addEventListener("keyup", () => this.set_notifications_url());
        this.notifications_url.target.value = sessionStorage.getItem(this.notifications_url.query)

        if (sessionStorage.getItem(this.notifications.query)) {
            this.checked_notifications.values = sessionStorage.getItem(this.notifications.query).split(",");
        }

        let custom_element = this;
        this.querySelectorAll(this.notifications.query).forEach((checkbox) => {
            if (custom_element.checked_notifications.values.includes(checkbox.value)) {
                checkbox.setAttribute("checked", "checked");
            }
            checkbox.addEventListener("click", () => this.set_notifications())
        });
    }

    setRequest(request) {
        this.request = request
    }

    set_webhook_id() {
        sessionStorage.setItem(this.webhook_id.query, this.webhook_id.target.value)
    }

    set_notifications() {
        this.checked_notifications.values = [];
        let custom_element = this;
        this.querySelectorAll(this.checked_notifications.query).forEach(function (checkbox) {
            custom_element.checked_notifications.values.push(checkbox.value)
        });
        sessionStorage.setItem(this.notifications.query, this.checked_notifications.values.join(","))
    }

    set_notifications_url() {
        sessionStorage.setItem(this.notifications_url.query, this.notifications_url.target.value)
    }

    async updateWebhook() {
        try {
            let client_id = document.querySelector(this.client_params.query).getClientId()

            let params = {
                notificationsUrl: this.notifications_url.target.value,
                notifications: this.checked_notifications.values,
            }

            let webhook_id = this.webhook_id.target.value
            await this.request.put("/api/v1/merchant/clients/" + client_id + "/webhooks/" + webhook_id, params).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    alert("Webhook " + webhook_id + " successfully updated!")
                } else {
                    if (response.status >= 400 && response.status < 500) {
                        response.data = JSON.parse(response.data)
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