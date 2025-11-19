import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function safeText(doc, text, x, y, maxWidth) {
  const lines = doc.splitTextToSize(String(text || ""), maxWidth || 500);
  doc.text(lines, x, y);
  return lines.length * 12;
}

async function captureElementImage(selector, scale = 1.25) {
  const el = document.querySelector(selector);
  if (!el) return null;
  try {
    const canvas = await html2canvas(el, { scale });
    return canvas.toDataURL("image/png");
  } catch (e) {
    console.warn("captureElementImage failed", selector, e);
    return null;
  }
}

async function generatePdfReport({
  selectedPoint,
  locationName,
  mapView,
  prediction,
  weatherData,
  nearestQuake,
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const pageH = doc.internal.pageSize.height;
  let y = 40;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Flood Analysis Report", margin, y);
  y += 28;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  safeText(
    doc,
    `Location: ${locationName || selectedPoint?.name || "(unnamed)"}`,
    margin,
    y,
    500
  );
  y += 14;

  const lat = selectedPoint?.latitude ?? "N/A";
  const lon = selectedPoint?.longitude ?? "N/A";
  safeText(doc, `Coordinates: ${lat}, ${lon}`, margin, y, 500);
  y += 20;

  // Map screenshot (prefer ArcGIS screenshot)
  let added = false;
  try {
    if (mapView && typeof mapView.takeScreenshot === "function") {
      const ss = await mapView.takeScreenshot({ width: 1200, height: 700 });
      const dataUrl = ss?.dataUrl || ss?.data || ss || null;
      if (dataUrl) {
        doc.addImage(dataUrl, "JPEG", margin, y, 500, 260);
        y += 270;
        added = true;
      }
    }
  } catch (e) {
    console.warn("mapView.takeScreenshot failed", e);
  }

  if (!added) {
    const img = await captureElementImage(".map-section", 1.25);
    if (img) {
      doc.addImage(img, "JPEG", margin, y, 500, 260);
      y += 270;
    }
  }

  // Charts capture (if present)
  const chartsImg = await captureElementImage(".charts-section", 1.25);
  if (chartsImg) {
    if (y + 240 > pageH) {
      doc.addPage();
      y = 40;
    }
    doc.addImage(chartsImg, "PNG", margin, y, 500, 220);
    y += 230;
  }

  // Prediction summary (expanded)
  if (prediction) {
    if (y + 140 > pageH) {
      doc.addPage();
      y = 40;
    }
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Prediction Summary", margin, y);
    y += 18;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    safeText(
      doc,
      `Risk level: ${prediction.risk_level ?? "N/A"}`,
      margin,
      y,
      500
    );
    y += 14;
    if (prediction.risk_score != null) {
      safeText(doc, `Risk score: ${prediction.risk_score}`, margin, y, 500);
      y += 14;
    }
    if (prediction.message) {
      const lines = doc.splitTextToSize(prediction.message, 500);
      doc.text(lines, margin, y);
      y += lines.length * 12 + 8;
    }

    // If the prediction contains additional metadata, include it
    const meta = { ...prediction };
    delete meta.risk_level;
    delete meta.risk_score;
    delete meta.message;
    if (Object.keys(meta).length) {
      safeText(doc, "Additional prediction details:", margin, y, 500);
      y += 14;
      Object.entries(meta).forEach(([k, v]) => {
        safeText(doc, `- ${k}: ${JSON.stringify(v)}`, margin + 8, y, 480);
        y += 12;
      });
      y += 8;
    }
  }

  // Weather snapshot (fuller)
  if (weatherData) {
    if (y + 180 > pageH) {
      doc.addPage();
      y = 40;
    }
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Weather Snapshot", margin, y);
    y += 18;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const cw = weatherData.current_weather || {};
    safeText(
      doc,
      `Current temperature: ${cw.temperature ?? "N/A"} °C`,
      margin,
      y,
      500
    );
    y += 14;
    safeText(
      doc,
      `Wind speed: ${cw.windspeed ?? cw.wind_speed ?? "N/A"} m/s`,
      margin,
      y,
      500
    );
    y += 14;
    if (cw.winddirection != null) {
      safeText(doc, `Wind direction: ${cw.winddirection}°`, margin, y, 500);
      y += 14;
    }
    safeText(doc, `Reference time: ${cw.time ?? "-"}`, margin, y, 500);
    y += 16;

    // Align precipitation/rain with current time using hourly arrays
    const hourly = weatherData.hourly || {};
    let precip = null;
    let rain = null;
    const curIso = cw.time;
    if (hourly.time && Array.isArray(hourly.time)) {
      let idx = -1;
      if (curIso) idx = hourly.time.indexOf(curIso);
      if (idx === -1) {
        const now = Date.now();
        let best = 0,
          bestDiff = Infinity;
        hourly.time.forEach((t, i) => {
          const d = Math.abs(new Date(t).getTime() - now);
          if (d < bestDiff) {
            best = i;
            bestDiff = d;
          }
        });
        idx = best;
      }
      if (idx >= 0) {
        precip = hourly.precipitation
          ? hourly.precipitation[idx] ?? null
          : null;
        rain = hourly.rain ? hourly.rain[idx] ?? null : null;
      }
    }

    safeText(
      doc,
      `Precipitation: ${precip != null ? `${precip} mm` : "N/A"}`,
      margin,
      y,
      500
    );
    y += 14;
    safeText(
      doc,
      `Rain: ${rain != null ? `${rain} mm` : "N/A"}`,
      margin,
      y,
      500
    );
    y += 14;

    // Optionally include a small hourly table around current index for context
    if (hourly.time && Array.isArray(hourly.time)) {
      const idx = (() => {
        if (!cw.time) return -1;
        return hourly.time.indexOf(cw.time);
      })();
      if (idx >= 0) {
        const start = Math.max(0, idx - 2);
        const end = Math.min(hourly.time.length - 1, idx + 2);
        safeText(doc, "Nearby hourly values:", margin, y, 500);
        y += 14;
        for (let i = start; i <= end; i++) {
          const t = hourly.time[i];
          const p = hourly.precipitation ? hourly.precipitation[i] ?? "-" : "-";
          const r = hourly.rain ? hourly.rain[i] ?? "-" : "-";
          safeText(
            doc,
            `${t} — precip: ${p} mm, rain: ${r} mm`,
            margin + 8,
            y,
            480
          );
          y += 12;
        }
        y += 8;
      }
    }
  }

  // Nearest earthquake (expanded)
  if (nearestQuake) {
    if (y + 160 > pageH) {
      doc.addPage();
      y = 40;
    }
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Nearest Earthquake", margin, y);
    y += 18;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const nq = nearestQuake;
    safeText(doc, `Magnitude: ${nq.magnitude ?? "N/A"}`, margin, y, 500);
    y += 14;
    safeText(doc, `Distance: ${nq.distance ?? "N/A"} km`, margin, y, 500);
    y += 14;
    if (nq.depth != null) {
      safeText(doc, `Depth: ${nq.depth} km`, margin, y, 500);
      y += 14;
    }
    if (nq.time) {
      const t = nq.time instanceof Date ? nq.time : new Date(nq.time);
      safeText(doc, `Time: ${t.toLocaleString()}`, margin, y, 500);
      y += 14;
    }
    if (nq.place) {
      const placeLines = doc.splitTextToSize(nq.place, 500);
      doc.text(placeLines, margin, y);
      y += placeLines.length * 12 + 6;
    }
    if (nq.url) {
      const urlLines = doc.splitTextToSize(nq.url, 500);
      doc.text(urlLines, margin, y);
      y += urlLines.length * 12 + 6;
    }
  }

  // Footer and save
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const footer = `Generated by Floods Insights — ${new Date().toLocaleString()}`;
  doc.text(footer, margin, pageH - 30);
  doc.save(`Flood-Report-${Date.now()}.pdf`);
}

export default generatePdfReport;
