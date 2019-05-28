export default function imageTemplate(image, alt) {
  return `<img class="artist__picture"
    src="${image.url}" alt="${alt}" width="${image.width}" height="${image.height}"></img>`;
}
