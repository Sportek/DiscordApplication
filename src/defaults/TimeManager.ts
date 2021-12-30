import moment from "moment";

export function convertTimestampToDate(date) {
    return moment(date).format("YYYY/MM/DD hh:mm")
    // 2021/08/12 12h58
}

export function getFormatedTimeFromSeconds(seconds) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    let dDisplay = d > 0 ? d + (d === 1 ? " jour, " : " jours, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " heure, " : " heures, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " seconde" : " secondes") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}