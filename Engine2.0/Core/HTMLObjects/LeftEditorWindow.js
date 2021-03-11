// import { HTMLObject } from "../HTMLObject.js";
// import { Vector2 } from "../Vector2.js";
// import { Div } from "./Div.js";
// import { List } from "./List.js";
// import { Button } from "./Button.js";

// export class LeftEditorWindow{
//     #list
//     constructor(){
//         this.#init()
//     }

//     #init = () => {
//         this.#list = new List(new Vector2(0, 0), new Vector2(`100%`, `100%`), 'ul', editorLeft)
//         window.leftEditorWindow = this
//     }

//     reload(){
//         this.#list?.removeAll()
//         for (let i = 0; i < window.htmlObjects?.length; i++) {
//             if(window.htmlObjects[i] != this.#list && window.htmlObjects[i].constructor.name != "ListItem"){
//                 this.#list?.addElement(window.htmlObjects[i].constructor.name)
//                 this.#list?.items(window.htmlObjects[i]).element.addEventListener('click', () => {
//                     console.log("?")
//                 })
//             } 
//         }
//         for (let i = 0; i < window.gameObjects?.length; i++) {
//             this.#list?.addElement(window.gameObjects[i].constructor.name)
//         }
//     }
// }