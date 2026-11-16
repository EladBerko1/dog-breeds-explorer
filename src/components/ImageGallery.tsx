interface ImageGalleryProps {
  images: string[]
  breedName: string
}

// רשת של תמונות. הכתובת של כל תמונה ייחודית, ולכן משמשת כ-key
function ImageGallery({ images, breedName }: ImageGalleryProps) {
  if (images.length === 0) {
    return <p>No photos for this breed yet.</p>
  }

  return (
    <ul className="image-gallery">
      {images.map((url, index) => (
        <li key={url}>
          <img src={url} alt={`${breedName} dog ${index + 1}`} loading="lazy" />
        </li>
      ))}
    </ul>
  )
}

export default ImageGallery
