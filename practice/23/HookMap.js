const { SyncHook, HookMap } = require("tapable");
const sleep = new HookMap(() => new SyncHook());
sleep.for("statement").tap("test", () => {
    console.log("callback for statement");
});
sleep.get("statement").call();