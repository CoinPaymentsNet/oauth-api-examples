export class CreateWebhook extends HTMLElement {
    webhook_button = {"query": "#create-webhook-button", "target": HTMLElement};
    notifications_url = {"query": "#create-notifications-url", "target": HTMLElement};
    notifications = {"query": ".create-notifications"};
    checked_notifications = {"query": ".create-notifications:checked", values: []};
    client_params = {"query": "client-params-block"}

    /**
     * Create a new instance of
     */
    constructor() {
        super();
    }

    async connectedCallback() {
        const response = await fetch("./js/createWebhook/createWebhook.html");
        this.innerHTML = await response.text();

        this.querySelector(this.webhook_button.query).addEventListener("click", () => this.createWebhook());

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

    async createWebhook() {
        try {
            let client_id = document.querySelector(this.client_params.query).getClientId()
            let params = {
                notificationsUrl: this.notifications_url.target.value,
                notifications: this.checked_notifications.values,
            }
            await this.request.post("/api/v1/merchant/clients/" + client_id + "/webhooks", params).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    response.data = JSON.parse(response.data)
                    alert("Webhook " + response.data.id + " successfully created!")
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