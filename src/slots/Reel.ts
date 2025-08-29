import * as PIXI from 'pixi.js';
import {AssetLoader} from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down
const SYM_HEIGHT = 200; // required for reel mask

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        const mask = this.createReelMask()
        this.container.addChild(mask);
        this.container.mask = mask

        this.createSymbols();
    }

    private createReelMask(): PIXI.Graphics {
        const mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, this.symbolSize * this.symbolCount, SYM_HEIGHT);
        mask.endFill();

        return mask;
    }

    private createSymbols(): void {
        for (let i = 0; i < this.symbolCount; i++) {
            const sym = this.createRandomSymbol();
            this.symbols.push(sym);
            sym.x = this.symbolSize * i;
            this.container.addChild(sym);
        }
    }

    private createRandomSymbol(): PIXI.Sprite {
        const symbolId = Math.floor(Math.random() * SYMBOL_TEXTURES.length);
        return new PIXI.Sprite(AssetLoader.getTexture(SYMBOL_TEXTURES[symbolId]));
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        const symbolsStripeWidth = this.symbols.length * this.symbolSize;

        for (let i = 0; i < this.symbols.length; i++) {
            const sym = this.symbols[i];
            sym.x += this.speed * delta;

            if (sym.x > symbolsStripeWidth) {
                sym.x = 0;

                this.symbols.splice(i, 1);
                this.symbols.unshift(sym);
                i--;
            }
        }

        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        this.symbols.forEach((symbol, i) => {
            symbol.x = i * this.symbolSize
        });
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}