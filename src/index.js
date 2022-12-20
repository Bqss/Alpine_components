import Alpine from "alpinejs";
import Dialog from "./components/DIalog";
import Dropdown from "./components/Dropdown";
import Tabs from "./components/Tabs";

Alpine.data("dropdown",Dropdown);
Alpine.data("dialog",Dialog);
Alpine.data("tabs",Tabs);

Alpine.start();