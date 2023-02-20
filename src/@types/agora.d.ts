// declare namespace THREE {
//   class Vector4 {
//     constructor(r: number, g: number, b: number, a: number);
//   }
// }

// declare class Utility {
//   static loadTextureAsync(zipUrl: string): Promise<any>;
//   static getBestDPIForCanvas(canvas: HTMLCanvasElement): number;
//   static updateCanvasDPI(canvas: HTMLCanvasElement, dpi: number);
// }

// declare type FilterOption = {
//   texture?: any;
//   color?: any;
//   reflection?: number | string;
//   brightness?: number | string;
//   contrast?: number | string;
//   saturation?: number | string;
//   sceneLens?: boolean;
// };

// declare class GlassesModel {
//   model: any;
//   modelDef: any;

//   getFilter(part: string);
//   setFilter(part: string, option: FilterOption);
//   setLensesFilter(option: FilterOption);
//   switchPart(key: string, value: any);
//   openGlasses();
//   closeGlasses();
// }

// declare class TryOnView {
//   currentGlasses: GlassesModel;
//   rootObject: any;

//   constructor(canvasId: string, shadowRoot: Node | null = null);

//   start(): Promise<void>;
//   stop();
//   tryGlasses(zipUrl: string, glassesType: string): Promise<void>;
//   refresh();
//   snapshot();
//   zoomIn();
//   zoomOut();
//   autoZoom(model: any, glassesType: string);
//   rotateCenter(rx: number, ry: number, rz: number);
// }

// declare class GlassesView extends TryOnView {
//   constructor(canvasId: string, shadowRoot: Node | null = null);
// }

declare class AgoraRTC {
  static createClient(params: { mode: string; codec: string })
  static onAutoplayFailed: () => void;
  static onAutoplayFailed();
  static onMicrophoneChanged(callback);
  static getMicrophones(): Promise<AnyObject>;
  static createMicrophoneAudioTrack();
}