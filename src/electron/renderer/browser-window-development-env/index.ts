import "../browser-window-production-env";

if (process.env.NODE_ENV === "development") {
    // tslint:disable:no-eval
    (window as any).__devtron = {
        require: eval("require"),
        process,
    };
    // tslint:enable:no-eval
}