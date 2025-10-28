function logData(e, t) {
    if (DiversityBackend.broadcastMethod == null)
        DiversityBackend.jankSaveBroadcastMethod(this.broadcastData.bind(this));

    if (DiversityBackend.routeEvent(e, t)) return;
}
