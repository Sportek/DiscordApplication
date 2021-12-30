export class PlayerExperience {
    private readonly _remainingExperience: number;
    private readonly _level : number;
    private readonly _neededExperience: number;
    constructor(level: number, remainngExperience: number, neededExperience: number) {
        this._remainingExperience = remainngExperience;
        this._level = level;
        this._neededExperience = neededExperience
    }

    get remainingExperience(): number {
        return this._remainingExperience;
    }

    get level(): number {
        return this._level;
    }

    get neededExperience(): number {
        return this._neededExperience;
    }
}