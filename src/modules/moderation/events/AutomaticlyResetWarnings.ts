import { BaseEvent, Event } from "@sportek/core-next-sportek";
import { WarningCollection } from "App/modules/moderation/collections/WarningCollection";

// @ts-ignore
@Event('fullReady')
export default class AutomaticlyResetWarnings implements BaseEvent {
    public async run(args: any): Promise<void> {
        setInterval(() => {
            WarningCollection.getInstance().resetAllWarnings();
        }, 3 * 60 * 60 * 1000)
    }
}
