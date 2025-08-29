import {Howl} from 'howler';

type SoundData = {
    url: string;
    alias: string
}

export class Sounds {
    private static _sounds: Record<string, Howl> = {};
    private static soundsToLoad: SoundData[] = [];


    static add(alias: string, url: string): void {
        this.soundsToLoad.push({url, alias})
    }

    static load(): Promise<void> {
        return new Promise<void>((resolve) => {
            let numberOfLoadedSounds = 0;

            const loadComplete = (): void => {
                numberOfLoadedSounds++;

                if (numberOfLoadedSounds === this.soundsToLoad.length) {
                    resolve();
                }
            };

            this.soundsToLoad.forEach(({url, alias}: SoundData) => {
                const sound = new Howl({
                    src: url,
                    onload: loadComplete,
                });

                Sounds.save(alias, sound);
            });
        });

    }

    static save(id: string, snd: Howl): void {
        this._sounds[id] = snd;
    }


    static play(id: string): void {
        try {
            if (this._sounds[id]) {
                this._sounds[id].play();
            }
        } catch (e) {
            console.warn(`Can't play sound ${id}`);
        }
    }

    static stop(id: string): void {
        try {
            if (this._sounds[id]) {
                this._sounds[id].stop();
            }
        } catch (e) {
            console.warn(`Can't stop sound ${id}`);
        }
    }
}
