import { Button } from "./Core/HTMLObjects/Button.js";
import { InputField } from "./Core/HTMLObjects/InputField.js";
import { LeftEditorWindow } from "./Core/HTMLObjects/LeftEditorWindow.js";
import { RightEditorWindow } from "./Core/HTMLObjects/RightEditorWindow.js";
import { Vector2 } from "./Core/Vector2.js";
import { Window } from "./Core/Window.js";

let tWindow = new Window()

new LeftEditorWindow()
new RightEditorWindow()
new InputField(new Vector2(`0px`, `0px`), new Vector2(`100px`, `100px`))
new Button(new Vector2(`0px`, `100px`), new Vector2(`100px`, `100px`))