# xgao0847_9103_individual-task
# Instructions on How to Interact with the Work

Once the page is loaded, the animation begins automatically. The Pac-Man character continuously moves through a yellow grid, consuming food pellets placed at intersections. The character will change color based on the most recent food pellet consumed. No user interaction is required.

---

# My Individual Approach to Animating the Group Code

While our group collaboratively recreated the geometric layout and color palette of Piet Mondrian’s *Broadway Boogie Woogie*, I contributed a time-based animation inspired by arcade games—specifically, Pac-Man. My goal was to inject a sense of motion, rhythm, and playfulness into the abstract composition, making the digital canvas feel alive.

---

# Animation Driver: Time-based

I chose **time** as the core driver of my animation. All motion is frame-based and occurs automatically over time without requiring any user input.

---

# Animated Properties & My Uniqueness

The most prominent animation in my version is the **moving Pac-Man character**, which navigates autonomously along the yellow grid lines. It randomly changes direction at intersections when the path is clear in all four directions. As it travels, it consumes food pellets placed at each yellow line intersection. Each pellet changes Pac-Man’s color to match its own. After 10 seconds, consumed pellets reappear, making the cycle continuous and rhythmic.

This approach stands apart from my group members, who chose to animate block size, color cycling, or random pixel reveals. My contribution introduces character motion, pathfinding, and timed pellet interactions.

---

# Inspiration References

### Pac-Man (1980)
The core concept was inspired by **Pac-Man**, one of the most iconic arcade games of all time. Besides being a classic, it’s also a symbol of interactive pop culture. The idea of a character navigating a geometric maze resonated well with the original grid-based design of *Broadway Boogie Woogie*.

![Pac-Man Reference](./Google_Pac-Man_banner.png)
> "Pac-Man was released in 1980 and became one of the most influential and recognizable video games in history. The titular character has since become a pop culture icon." — *Wikipedia*

### Mondrian’s *Broadway Boogie Woogie*
Our base group image was Piet Mondrian’s *Broadway Boogie Woogie*, which was itself inspired by jazz rhythms and city grids. Its vibrant primary color blocks and intersecting yellow lines reminded me of game boards. That connection became the conceptual bridge between abstract visual art and retro game logic.

---

# Technical Explanation

The core animation is achieved through a loop inside the `draw()` function. Pac-Man moves in small steps based on a direction (0, 90, 180, or 270 degrees). At each step, the script checks whether the next pixel in the intended direction is part of a passable yellow grid line. If not, Pac-Man reverses or randomly turns at valid intersections.

Each pellet is represented as a small circle object with a `deadTime` property. When eaten, it disappears temporarily and is restored after 10 seconds. The Pac-Man’s fill color is also updated dynamically to match the consumed pellet’s color.

The mouth-opening effect of Pac-Man is controlled with a sine wave mapped to an angle range, giving a rhythmic "chomping" motion over time.

---

# Changes to Group Code

I preserved the group’s original static layout and palette but added significant structure to manage animation timing, pellet object lifecycles, and directional logic. These include:
- A `pacman` object to store position, direction, speed, and color
- `foods[]` array with respawn timers and color variation
- `checkNextPos()` and `checkAllAround()` functions for movement validation
- A `drawPacMan()` function with dynamic arc angles

---

# Tools and Techniques from Outside

## Pixel Color Collision Detection with get()

- Using get() to read pixel color: 
The get(x, y) function is an official part of the p5.js library for retrieving pixel data from the canvas. When called with two parameters (x and y coordinates), it returns an array containing the Red, Green, Blue, and Alpha values of the pixel at that position. This allows a sketch to inspect what color is drawn at a specific location on the canvas.

- Collision detection via color checking: 
Developers often use get() for simple collision or hit detection by comparing the color of a pixel to a target color. For example, if your background is black and your obstacles are drawn in a different color, you can check the pixel in front of a moving object: if get(nextX, nextY) returns a color that is not the background (black), it means the object hit something. In other words, a collision is detected when the pixel’s color differs from the “empty” background color (or matches a specific obstacle color).

- Why I chose this method: 
In the my project, get() was used to sense collisions because it provides a straightforward way to detect contact with drawn shapes or boundaries using color cues. This technique goes beyond basic shape-overlap collision taught in class – it leverages pixel data on the canvas. The approach is documented in p5.js community resources, confirming that reading a pixel’s RGBA value via get() is a valid method to detect crashes or overlaps in a sketch. It’s easy to implement (one function call) and sufficient for projects where objects and backgrounds have distinct colors.

[p5js Reference](https://p5js.org/reference/p5/get/#:~:text=The%20version%20of%20,pixel%20at%20the%20given%20point)
[studocu](https://www.studocu.com/en-gb/document/manchester-metropolitan-university/computer-science/lab-wk5-functions-week-5-lab-work-for-unitprogramming/8309518)


## Animating Arc Angles with sin(frameCount) (Pac-Man Mouth Effect)

- Oscillating arc with a sine wave: 
A common trick for smooth periodic animation is to use the sine of the frame count. sin(frameCount * speed) oscillates between -1 and 1 as the sketch runs. By scaling this and offsetting it, you can make an arc’s start and end angles swing open and closed over time. For example, a Pac-Man style mouth can be achieved by defining a base “bite” angle (how wide the mouth opens) and varying it with sin. One p5.js example uses let biteSize = PI/16; and then updates the angles each frame as: startAngle = biteSize * sin(frameCount * 0.1) + biteSize; and endAngle = TWO_PI - startAngle. This means the startAngle oscillates between 0 and a small angle (here around 22.5°) and the endAngle mirrors it, resulting in a continuously opening and closing arc.

- Pac-Man 'mouth' animation: 
Using the above technique, the arc drawn with arc(x, y, w, h, startAngle, endAngle, PIE) will look like a Pac-Man mouth chomping. When sin(frameCount * 0.1) is 0, startAngle equals the base angle (biteSize), and when sin is ±1, startAngle reaches its min or max, making the mouth fully closed or fully open. The community forum example shows this in action – as frameCount increases, sin makes the mouth angle pivot back and forth smoothly. This approach doesn’t require manual angle toggling; the mathematical sine wave handles the continuous transition.

- Why the user implemented this: 
I adopted the sin-based arc animation to create a dynamic visual effect beyond static shapes. It produces a smooth, looping open-close motion (like the classic Pac-Man Waka-Waka) with minimal code. This technique is mentioned in p5.js tutorials and community sketches because it’s an elegant way to animate properties over time. By referencing a known example of Pac-Man’s mouth animated with sin(frameCount), I can justify that this oscillating arc pattern is a well-established practice for lively animations in p5.js.

[Rotate arc in pacman animation](https://discourse.processing.org/t/rotate-arc-in-pacman-animation/45367)

---