class BitArray {
  private items: boolean[] = [];
  public index = 0;

  get length(): number {
    return this.items.length;
  }

  lastIndexOf(value: boolean) {
    return this.items.lastIndexOf(value);
  }

  splice(start, ...args) {
    this.items.splice(start, ...args);
  }

  join(...args) {
    return this.items.map(value => value ? '1' : '0').join(...args);
  }

  writeBool(value: boolean) {
    this.items.splice(this.index++, 0, value);
  }

  readBool() {
    return this.items[this.index++];
  }

  writeUInt(value: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.writeBool(((value >> i) & 1) == 1);
    }
  }

  readUInt(length: number): number {
    let value = 0;
    for (let i = 0; i < length; i++) {
      value |= ((this.readBool() ? 1 : 0) << i);
    }
    return value;
  }

  writeInt(value: number, length: number) {
    length--;

    this.writeBool(value < 0);
    this.writeUInt(Math.min(Math.abs(value), (1 << length) - 1), length);
  }

  readInt(length: number) {
    const minus = this.readBool();
    const value = this.readUInt(length - 1);
    return minus ? -value : value;
  }
}

class Base64 {
  static readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  static readonly PADCHAR = '.';

  static toB64(barray: BitArray): string {
    barray.index = 0;

    const byteLength = Math.ceil(barray.length / 8);
    const padding = byteLength % 3;
    const length = byteLength - padding;
    const b64 = [];

    for (let i = 0; i < length; i += 3) {
      const val1 = barray.readUInt(8) << 16;
      const val2 = barray.readUInt(8) << 8;
      const val3 = barray.readUInt(8);
      const value = val1 + val2 + val3;

      b64.push(Base64.CHARS.charAt(value >> 18 & 0x3F));
      b64.push(Base64.CHARS.charAt(value >> 12 & 0x3F));
      b64.push(Base64.CHARS.charAt(value >> 6 & 0x3F));
      b64.push(Base64.CHARS.charAt(value & 0x3F));
    }

    if (padding == 2) {
      const val1 = barray.readUInt(8) << 8;
      const val2 = barray.readUInt(8);
      const value = val1 + val2;

      b64.push(Base64.CHARS.charAt(value >> 10));
      b64.push(Base64.CHARS.charAt((value >> 4) & 0x3F));
      b64.push(Base64.CHARS.charAt((value << 2) & 0x3F));
      b64.push(Base64.PADCHAR);
    } else if (padding == 1) {
      const value = barray.readUInt(8);

      b64.push(Base64.CHARS.charAt(value >> 2));
      b64.push(Base64.CHARS.charAt((value << 4) & 0x3F));
      b64.push(Base64.PADCHAR);
      b64.push(Base64.PADCHAR);
    }

    return b64.join('');
  }

  static fromB64(b64): BitArray {
    let length = b64.length;
    b64 = b64.replace(/\.\.?$/, '');
    const padding = b64.length - length;
    length = b64.length;

    const barray = new BitArray();
    let i;
    for (i = 0; i < b64.length; i += 4) {
      const val1 = Base64.CHARS.indexOf(b64.charAt(i)) << 18;
      const val2 = Base64.CHARS.indexOf(b64.charAt(i + 1)) << 12;
      const val3 = Base64.CHARS.indexOf(b64.charAt(i + 2)) << 6;
      const val4 = Base64.CHARS.indexOf(b64.charAt(i + 3));
      const value = val1 + val2 + val3 + val4;

      barray.writeUInt(value >> 16, 8);
      barray.writeUInt(value >> 8, 8);
      barray.writeUInt(value, 8);
    }

    if (padding == 2) {
      const val1 = Base64.CHARS.indexOf(b64.charAt(i)) << 10;
      const val2 = Base64.CHARS.indexOf(b64.charAt(i + 1)) << 4;
      const val3 = Base64.CHARS.indexOf(b64.charAt(i + 2)) >> 2;
      const value = val1 + val2 + val3;

      barray.writeUInt(value >> 8, 8);
      barray.writeUInt(value, 8);
    } else if (padding == 1) {
      const val1 = Base64.CHARS.indexOf(b64.charAt(i)) << 2;
      const val2 = Base64.CHARS.indexOf(b64.charAt(i + 1)) >> 4;
      const value = val1 + val2;

      barray.writeUInt(value, 8);
    }

    return barray;
  }
}

interface IScenarioCompressor {
  compress(barray: BitArray, currentNodes);
  decompress(barray: BitArray): { nodes: any[], version: number };
}

class ScenarioCompressorV0 implements IScenarioCompressor {
  readonly statusLookup = [
    'hidden',
    'incomplete',
    'attempted',
    'complete',
  ];

  // New scenario ids can be added to the end but moving, removing or inserting a scenario id will breaks compatibilty
  // If for whatever reason you need to do this, you need to increment the version
  readonly nodeIds = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
  ];

  readonly arrayNext = false;
  readonly arrayOffset = true;

  readonly arrayOffsetLength = 4;
  readonly arrayOffsetMaxValue = (1 << this.arrayOffsetLength) - 1;
  readonly arrayOffsetMinimum = 5;
  readonly statusLength = 2;
  // range -8191 to 8191
  readonly positionLength = 14;

  compress(barray: BitArray, currentNodes) {
    currentNodes = currentNodes.nodes.reduce((map, node) => {
      map[node.id] = {
        "status": node.status != null ? this.statusLookup.indexOf(node.status) : null,
        "position": typeof node.x == "number" || typeof node.y == "number" ? [
          node.x,
          node.y,
        ] : null,
      };
      return map;
    }, {});

    let checkPosition = false;
    const diffNodes = this.nodeIds.map(nodeId => {
      const currentNode = currentNodes[nodeId];
      if (currentNode['status'] == null && currentNode['position'] == null) {
        return null;
      } else {
        if (currentNode['position'] != null) {
          checkPosition = true;
        }
        return currentNode;
      }
    });
    barray.writeBool(checkPosition);

    let offset = 0;
    for (const nodeId in diffNodes) {
      const node = diffNodes[nodeId];
      if (node != null) {
        while (offset > 0) {
          if (offset >= this.arrayOffsetMinimum) {
            // offset will never be less than the minimum so use this opportunity to optimize
            offset -= this.arrayOffsetMinimum;
            const value = Math.min(offset, this.arrayOffsetMaxValue);
            offset -= value;

            barray.writeBool(this.arrayOffset);
            barray.writeUInt(value, this.arrayOffsetLength);
          } else {
            barray.writeBool(this.arrayNext);

            barray.writeBool(false); //status has value
            if (checkPosition) {
              barray.writeBool(false); //position has value
            }
            offset--;
          }
        }
        barray.writeBool(this.arrayNext);

        const status = node['status'];
        if (status != null) {
          barray.writeBool(true);
          barray.writeUInt(status, this.statusLength);
        } else {
          barray.writeBool(false);
        }

        if (checkPosition) {
          const position = node['position'];
          if (position != null) {
            barray.writeBool(true);
            barray.writeInt(position[0], this.positionLength);
            barray.writeInt(position[1], this.positionLength);
          } else {
            barray.writeBool(false);
          }
        }
      } else {
        offset += 1;
      }
    }
  }

  decompress(barray: BitArray) {
    const checkPosition = barray.readBool();

    let nodeIndex = -1;
    const nodes = [];
    while (barray.index < barray.length) {
      while (barray.readBool() == this.arrayOffset) {
        // read offset and revert the minimum offset optimization
        const offset = barray.readUInt(this.arrayOffsetLength) + this.arrayOffsetMinimum;
        for (let i = 0; i < offset; i++) {
          nodes.push({
            'id': this.nodeIds[++nodeIndex],
          });
        }
      }
      nodeIndex++;

      let status;
      if (barray.readBool()) {
        status = barray.readUInt(this.statusLength);
      } else {
        status = null;
      }

      let x, y;
      if (checkPosition && barray.readBool()) {
        x = barray.readInt(this.positionLength);
        y = barray.readInt(this.positionLength);
      } else {
        x = null;
        y = null;
      }

      const node = {
        'id': this.nodeIds[nodeIndex],
      }
      if (status != null) {
        node['status'] = this.statusLookup[status];
      }
      if (x != null) {
        node['x'] = x;
      }
      if (y != null) {
        node['y'] = y;
      }
      nodes.push(node);
    }
    for (nodeIndex++; nodeIndex < this.nodeIds.length; nodeIndex++) {
      nodes.push({
        'id': this.nodeIds[nodeIndex],
      });
    }

    return {
      nodes: nodes,
      version: 2,
    };
  }
}

export class ScenarioCompressor {
  // max value is 255 as defined by versionLength
  static readonly currentVersion = 0;
  static readonly versionLength = 8;

  static readonly versions = {
    0: new ScenarioCompressorV0(),
  };

  static compress(currentNodes, version=ScenarioCompressor.currentVersion) {
    const self = ScenarioCompressor;

    const barray = new BitArray();
    // write version
    barray.writeUInt(version, self.versionLength);
    self.versions[version].compress(barray, currentNodes);
    // lets us detect padding
    barray.writeBool(true);

    console.log(barray.join('').length);
    return Base64.toB64(barray);
  }

  static decompress(b64: string) {
    const self = ScenarioCompressor;

    const barray = Base64.fromB64(b64);
    // remove padding
    barray.splice(barray.lastIndexOf(true), barray.length - 1);
    barray.index = 0;

    const version = barray.readUInt(self.versionLength);
    if (version in self.versions) {
      return self.versions[version].decompress(barray);
    }

    throw new Error(`Unknown version ${version}`);
  }
}
