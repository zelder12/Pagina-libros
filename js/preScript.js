var url = '';

if (window.location.pathname.includes('presentacion1.html')) {
    url = '../presentacion-txt/pre_libro1.pdf';
} else if (window.location.pathname.includes('presentacion2.html')) {
    url = '../presentacion-txt/pre_libro2.pdf';
} else if (window.location.pathname.includes('presentacion3.html')) {
    url = '../presentacion-txt/pre_libro3.pdf';
} else {
    console.error('No se encontró un presentacion para esta página.');
}

var pdfDoc = null,
    pageNum = 1,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas ? canvas.getContext('2d') : null,
    rendering = false; // Variable para evitar renderizados simultáneos

function renderPage(num) {
    if (!pdfDoc || rendering) return; // Evitar renderizados simultáneos

    rendering = true; // Marcar que estamos renderizando

    pdfDoc.getPage(num).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport({ scale: scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Limpiar el canvas antes de cada renderizado
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        // Renderizamos la página
        return page.render(renderContext).promise;
    }).then(function () {
        // Una vez renderizada la página, actualizamos la interfaz
        document.getElementById('page-num').textContent = pageNum;
        document.getElementById('prev-btn').disabled = (pageNum === 1);
        document.getElementById('next-btn').disabled = (pageNum === pdfDoc.numPages);

        rendering = false; // Permitimos un nuevo renderizado
    }).catch(function (error) {
        console.error('Error al renderizar la página:', error);
        rendering = false; // Permitimos un nuevo renderizado en caso de error
    });
}

function prevPage() {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
    }
}

function nextPage() {
    if (pageNum < pdfDoc.numPages) {
        pageNum++;
        renderPage(pageNum);
    }
}

function goToPage() {
    var pageInput = document.getElementById('page-selector').value;
    var desiredPage = parseInt(pageInput, 10); // Convertir a número

    // Verificar que la página sea válida
    if (!isNaN(desiredPage) && desiredPage >= 1 && desiredPage <= pdfDoc.numPages) {
        pageNum = desiredPage;
        renderPage(pageNum);
    } else {
        alert('Número de página inválido');
    }
}

if (url) {
    pdfjsLib.getDocument(url).promise.then(function (pdf) {
        pdfDoc = pdf;
        document.getElementById('page-count').textContent = pdf.numPages;
        renderPage(pageNum);
    }).catch(function (error) {
        console.error('Error al cargar el PDF:', error);
    });
}

// Manejo de teclas ← y →
document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowLeft") prevPage();
    if (event.key === "ArrowRight") nextPage();
});

// Obtener el número de la presentación actual
let match = window.location.pathname.match(/presentacion(\d+)\.html/);
if (match) {
    let currentPresentation = parseInt(match[1]);
    let nextPresentation = currentPresentation + 1;
    let prevPresentation = currentPresentation - 1;
    let nextPresentationLink = document.getElementById("next-presentation-link");
    let prevPresentationLink = document.getElementById("prev-presentation-link");

    // Configurar el enlace a la siguiente presentación
    if (nextPresentation > 3) {
        nextPresentationLink.style.pointerEvents = "none";
        nextPresentationLink.style.opacity = "0.5";
    } else {
        nextPresentationLink.href = `presentacion${nextPresentation}.html`;
    } 
    
    // Configurar el enlace a la presentación anterior o deshabilitar si es la primera
    if (prevPresentation >= 1) {
        prevPresentationLink.href = `presentacion${prevPresentation}.html`;
    } else {
        prevPresentationLink.style.pointerEvents = "none";
        prevPresentationLink.style.opacity = "0.5";
    }
}
