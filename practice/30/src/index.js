import component from "./component";
let demoComponent = component();
document.body.appendChild(demoComponent);
console.log(99)
if (module.hot) {
    // Capture hot update
    module.hot.accept("./component", () => {
        let demoComponent = component();
        document.body.appendChild(demoComponent);

        // const nextComponent = component();

        // // Replace old content with the hot loaded one
        // document.body.replaceChild(nextComponent, demoComponent);

        // demoComponent = nextComponent;
    });
}
// module.hot.accept();