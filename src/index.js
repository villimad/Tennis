import {pr} from './myfunc'
import MyClass from "./myclass";

document.getElementById('but').addEventListener('click', ()=>{
   pr();
   let my = new MyClass();
   my.pr();
});