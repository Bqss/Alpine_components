import Alpine from "alpinejs";
import Carousel from "./components/Carousel";
import Dialog from "./components/DIalog";
import Dropdown from "./components/Dropdown";
import Tabs from "./components/Tabs";
import Select from "./components/Select";
import Select2 from "./components/Selectv2";


Alpine.data("dropdown",Dropdown);
Alpine.data("dialog",Dialog);
Alpine.data("tabs",Tabs);
Alpine.data("carousel",Carousel);
Alpine.data("select",Select);
Alpine.data("select2",Select2);

Alpine.start();