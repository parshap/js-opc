## Strand

```
var createStrand = require("opc/strand");
```

### `var strand = createStrand(length)`

Create a *strand* object representing a series of *length* pixels. The
strand provides a `strand.setPixel()` function  to set the color of each
pixel.

Pixel state is stored in *buffer* (`strand.buffer)` in Open Pixel
Control format (i.e., used in the data block of a *set pixel color*
command).

### `strand.setPixel(index, r, g, b)`

Set color at *index* to the given *rgb* value.

### `strand.slice(start, end)`

Returns a new strand which references the same state as the old, but
offset and cropped by the *start* and *end* indexes.

**Modifying the new strand slice will modify the original strand!**

### `strand.buffer`

Binary data representing the strand's pixel colors. The size of the
buffer will be `strand.length * 3` bytes.

### `strand.length`

The number of pixels in the strand.
