(function () {
    if (window.__sidePanelInjected) return;
    window.__sidePanelInjected = true;

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("index.html");
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.right = "0";
    iframe.style.width = "30%";
    iframe.style.height = "100%";
    iframe.style.zIndex = "999999999";
    iframe.style.border = "none";
    iframe.style.background = "white";

    document.body.appendChild(iframe);

    const toggle = document.createElement("div");
    toggle.innerHTML = "≡";
    toggle.style.position = "fixed";
    toggle.style.top = "60%";
    toggle.style.right = "0";
    toggle.style.transform = "translateY(-50%)";
    toggle.style.width = "40px";
    toggle.style.height = "40px";
    toggle.style.background = "#000";
    toggle.style.color = "#fff";
    toggle.style.cursor = "pointer";
    toggle.style.zIndex = "1000000000";
    toggle.style.display = "flex";
    toggle.style.alignItems = "center";
    toggle.style.justifyContent = "center";
    toggle.style.borderRadius = "4px 0 0 4px";

    let visible = true;
    toggle.addEventListener("click", () => {
        visible = !visible;
        iframe.style.display = visible ? "block" : "none";
    });

    document.body.appendChild(toggle);

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
})();
