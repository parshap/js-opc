## Stream

```
var createStream = require("opc");
```

### `var stream = createStream()`

Creates a stream that emits Open Pixel Control protocol messages.

### `stream.writePixels(channel, pixels)`

Emits a *[set pixel colors][opc set]* command message with the color
data in the *pixels* buffer.

[opc set]: https://github.com/scanlime/fadecandy/blob/master/doc/fc_protocol_opc.md#set-pixel-colors

### `stream.writeColorCorrection(config)`

Emits a [Fadecandy *set global color correction*][fc color] command
message with the given *config* object.

[fc color]: https://github.com/scanlime/fadecandy/blob/master/doc/fc_protocol_opc.md#set-global-color-correction

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
