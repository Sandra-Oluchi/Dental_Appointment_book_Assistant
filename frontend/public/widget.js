(function () {
  const existingWidget = document.getElementById("dental-clinic-ai-widget-root");
  if (existingWidget) {
    return;
  }

  const WIDGET_URL = "http://127.0.0.1:3002/chatwidget";

  const root = document.createElement("div");
  root.id = "dental-clinic-ai-widget-root";
  root.style.position = "fixed";
  root.style.left = "20px";
  root.style.bottom = "20px";
  root.style.zIndex = "2147483647";
  root.style.fontFamily =
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  const iframe = document.createElement("iframe");
  iframe.id = "dental-clinic-ai-widget";
  iframe.title = "Dental Clinic AI Assistant";
  iframe.src = WIDGET_URL;
  iframe.style.display = "none";
  iframe.style.width = "340px";
  iframe.style.maxWidth = "calc(100vw - 32px)";
  iframe.style.height = "540px";
  iframe.style.maxHeight = "calc(100vh - 88px)";
  iframe.style.border = "0";
  iframe.style.borderRadius = "12px";
  iframe.style.boxShadow = "0 24px 70px rgba(15, 23, 42, 0.24)";
  iframe.style.background = "white";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Chat";
  button.setAttribute("aria-label", "Open Dental Clinic AI Assistant");
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.marginTop = "12px";
  button.style.width = "64px";
  button.style.height = "44px";
  button.style.border = "0";
  button.style.borderRadius = "999px";
  button.style.background = "#047857";
  button.style.color = "white";
  button.style.fontSize = "15px";
  button.style.fontWeight = "700";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 12px 32px rgba(4, 120, 87, 0.32)";

  let isOpen = false;

  function updateWidgetState() {
    iframe.style.display = isOpen ? "block" : "none";
    button.textContent = isOpen ? "Close" : "Chat";
    button.setAttribute(
      "aria-label",
      isOpen
        ? "Close Dental Clinic AI Assistant"
        : "Open Dental Clinic AI Assistant",
    );
  }

  button.addEventListener("click", function () {
    isOpen = !isOpen;
    updateWidgetState();
  });

  root.appendChild(iframe);
  root.appendChild(button);
  document.body.appendChild(root);

  updateWidgetState();
})();
