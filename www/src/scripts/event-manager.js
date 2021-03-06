class EventManager {
    constructor() {
        if (this.enabled) {
            this.eventSource = new window.EventSource('/stream/')
        }
    }

    get enabled() {
        return window.EventSource != null
    }
}


export default new EventManager()
