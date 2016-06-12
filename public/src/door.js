Quintus.Door = function(Q) {
    Q.Sprite.extend("Door", {
        init: function(p) {
            this._super(p, {
                type: Q.SPRITE_DOOR,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                vx: 0,
                vy: 0,
                gravity: 0
            });

            this.on("sensor");
        },

        findLinkedDoor: function() {
            var door = this;
            var returnVal;
            Q("Door").each(function() {
                if (this.p.id === door.p.link) {
                    returnVal = this;
                }
            });

            return returnVal;
        },

        // When the player is in the door.
        sensor: function(colObj) {
            // Mark the door object on the player.
            colObj.p.door = this;
        }
    });

    Q.Door.extend("Original", {
        init: function(p) {
            this._super(Q._defaults(p, {
                sheet: "door"
            }));
        }
    });

    Q.Door.extend("Pipe", {
        init: function(p) {
            this._super(Q._defaults(p, {
                sheet: "pipe"
            }));
        }
    });

    Q.Door.extend("Normal", {
        init: function(p) {
            this._super(Q._defaults(p, {
                sheet: "normal"
            }));
        }
    });

    Q.Door.extend("Igloo", {
        init: function(p) {
            this._super(Q._defaults(p, {
                sheet: "igloo"
            }));
        }
    });
}
