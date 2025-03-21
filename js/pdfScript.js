// Obtener la URL actual
var url = '';

if (window.location.pathname.includes('libro1.html')) {
    url = '../libros-txt/libro1.pdf';
} else if (window.location.pathname.includes('libro2.html')) {
    url = '../libros-txt/libro2.pdf';
} else if (window.location.pathname.includes('libro3.html')) {
    url = '../libros-txt/libro3.pdf';
} else {
    console.error('No se encontró un libro para esta página.');
}

var pdfDoc = null,
    pageNum = 1,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas ? canvas.getContext('2d') : null,
    rendering = false; // Variable para evitar renderizados simultáneos

function renderPage(num) {
    if (!pdfDoc || rendering) return; // Evitar renderizados simultáneos

    rendering = true; // Marcar que estamos renderizando

    pdfDoc.getPage(num).then(function(page) {
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
    }).then(function() {
        // Una vez renderizada la página, actualizamos la interfaz
        document.getElementById('page-num').textContent = pageNum;
        document.getElementById('prev-btn').disabled = (pageNum === 1);
        document.getElementById('next-btn').disabled = (pageNum === pdfDoc.numPages);

        rendering = false; // Permitimos un nuevo renderizado
    }).catch(function(error) {
        console.error('Error al renderizar la página:', error);
        rendering = false; // Permitimos un nuevo renderizado en caso de error
    });
}

function prevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
}

function nextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
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
    pdfjsLib.getDocument(url).promise.then(function(pdf) {
        pdfDoc = pdf;
        document.getElementById('page-count').textContent = pdf.numPages;
        renderPage(pageNum);
    }).catch(function(error) {
        console.error('Error al cargar el PDF:', error);
    });
}

// Manejo de teclas ← y →
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowLeft") prevPage();
    if (event.key === "ArrowRight") nextPage();
});

// Obtener el número del libro actual
let match = window.location.pathname.match(/libro(\d+)\.html/);
if (match) {
    let currentBook = parseInt(match[1]);
    let nextBook = currentBook + 1;
    let prevBook = currentBook - 1;
    let nextBookLink = document.getElementById("next-book-link");
    let prevBookLink = document.getElementById("prev-book-link");

    // Configurar el enlace al siguiente libro
    if (nextBook > 3) {
        nextBookLink.style.pointerEvents = "none";
        nextBookLink.style.opacity = "0.5";
        
    } else {
        nextBookLink.href = `libro${nextBook}.html`;
    }
    // Configurar el enlace al libro anterior o deshabilitar si es el primero
    if (prevBook >= 1) {
        prevBookLink.href = `libro${prevBook}.html`;
    } else {
        prevBookLink.style.pointerEvents = "none";
        prevBookLink.style.opacity = "0.5";
    }
}
