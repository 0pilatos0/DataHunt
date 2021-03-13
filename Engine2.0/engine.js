import { Player } from "./Core/GameObjects/Player.js";
import { Button } from "./Core/HTMLObjects/Button.js";
import { InputField } from "./Core/HTMLObjects/InputField.js";
import { Vector2 } from "./Core/Vector2.js";
import { Window } from "./Core/Window.js";

new Window()

new InputField(new Vector2(`0px`, `0px`), new Vector2(`100px`, `100px`))
new Button(new Vector2(`0px`, `100px`), new Vector2(`100px`, `100px`))
new Player(new Vector2(0, 0), new Vector2(96, 96), true)