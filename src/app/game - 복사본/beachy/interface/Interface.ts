
import { EventEmitter, Output, Component,OnInit,AfterViewInit,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {Settings} from './types';
import {Storage} from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-interface',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, MatIconModule],
  templateUrl: './interface.html',
  styleUrls: ['../../game.scss']
})
export class Interface implements OnInit, AfterViewInit{

  public settings: Settings = {
    isInGame: false,
    isSettings: false,
    mode: 'random',
    difficulty: 1,
    blocksCount: 10,
    level: 'copacabana',
    audio: true
  }

  private storage: Storage;

  public phase = null;
  public audio = false;
  public isModalOpen = false;
  // public mode = "모드";
  public time = "타임";
  public modeOptions = "모드옵션";


  public  modes = [
    { id: "0", text: "Random", name: "random" },
    { id: "1", text: "Tour", name: "tour" },
    { id: "2", text: "Adventure", name: "adventure" },
  ];

  constructor(storage: Storage) { 
    this.storage = storage;
    const settings = storage.get('beachyball.settings');
    settings ? this.settings = settings : null; 
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  // const { mode, setMode, restart, phase, setIsInGame } = useGame();

  public restart() {}
  public toggleAudio() {
    this.settings.audio = !this.settings.audio;

    this.store();
  }
  public setIsModalOpen(bool:boolean) {
    this.isModalOpen = bool;
  }
  public clearData() {
    this.storage.clear();
  }
  public setIsInGame(bool:boolean) {
    this.settings.isInGame = bool;
    this.store();
  }

  public handleModeClick(mode: string) {
    // setSelectedMode(mode);
    this.settings.mode = mode;
    this.store();

    // restart......
    // handleModeClick(mode);
    //           setMode(`${mode.name}`);
    //           window.localStorage.setItem("mode", `"${mode.name}"`);
    //           handleRestart();
  }

//   const time = useRef();
//   const { mode, setMode, restart, phase, setIsInGame } = useGame();
//   const { audio, toggleAudio } = useAudio();
//   // const forward = useKeyboardControls((state) => state.forward);
//   // const backward = useKeyboardControls((state) => state.backward);
//   // const leftward = useKeyboardControls((state) => state.leftward);
//   // const rightward = useKeyboardControls((state) => state.rightward);
//   // const jump = useKeyboardControls((state) => state.jump);

//   /**
//    * Mode
//    */
//   const [modeName, setModeName] = useState(mode);

  
//   useEffect(() => {
//     switch (mode) {
//       case "random":
//         setModeName("Random");
//         break;
//       case "tour":
//         setModeName("Tour");
//         break;
//       case "adventure":
//         setModeName("Adventure");
//         break;
//     }
//   }, [mode]);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Restart game
//       if (e.code === "Escape") {
//         setIsModalOpen((prev) => !prev);
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isModalOpen, setIsModalOpen]);

//   const clearData = () => {
//     window.localStorage.clear();
//   };

//   const handleRestart = () => {
//     restart();
//   };

//   const [selectedMode, setSelectedMode] = useState(null);

//   useEffect(() => {
//     setSelectedMode(modeOptions.find((m) => m.name === mode));
//   }, []);

//   function handleModeClick(mode) {
//     setSelectedMode(mode);
//   }

//   useEffect(() => {
//     const unsubscribeEffect = addEffect(() => {
//       const state = useGame.getState();

//       let elapsedTime = 0;

//       if (state.phase === "playing") {
//         elapsedTime = Date.now() - state.startTime;
//       } else if (state.phase === "ended") {
//         elapsedTime = state.endTime - state.startTime;
//       }

//       elapsedTime /= 1000;
//       elapsedTime = elapsedTime.toFixed(2);

//       if (time.current) {
//         time.current.textContent = elapsedTime;
//       }
//     });

//     return () => {
//       unsubscribeEffect();
//     };
//   }, []);

//   let modes = [
//     { id: "0", text: "Random", name: "random" },
//     { id: "1", text: "Tour", name: "tour" },
//     { id: "2", text: "Adventure", name: "adventure" },
//   ];

//   const modeOptions = modes.map((mode) => (
//     <div
//       key={mode.id}
//       class={`mode-selection ${
//         selectedMode && selectedMode.name === mode.name ? "selected-mode" : ""
//       }`}
//       onClick={() => {
//         handleModeClick(mode);
//         setMode(`${mode.name}`);
//         window.localStorage.setItem("mode", `"${mode.name}"`);
//         handleRestart();
//       }}
//     >
//       {mode.text}
//     </div>
//   ));

//   return (
    
//   );
// }

  private store() {
    this.storage.set('beachyball.settings', this.settings);
  }
}