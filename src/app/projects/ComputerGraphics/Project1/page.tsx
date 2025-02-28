"use client";

import path from "path";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import { ImageContainer, Figure } from "@/components/ImageContainer";
import Image from "next/image";
import { MathJax } from "better-react-mathjax";
import { Sidebar } from "@/components/Sidebar";

import type { articleElem } from "@/components/ContentContainer";

const base = "/projects/ComputerGraphics/Project1";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Drawing Triangles",
    content: (
      <div>
        <h2>Drawing Triangles</h2>
        <p>
          Triangles are both simple and flexible making them important when it
          comes to drawing to the screen. The first method of drawing a triangle
          involves checking for each pixel, whether it lies inside or outside of
          the triangle we want to draw.
        </p>
        <p>
          We do this through the half-plane point in polygon test. Given three
          points <MathJax inline={true}>{"\\(p_{1}, p_{2}, p_{3}\\)"}</MathJax>{" "}
          oriented counter clockwise, we want to see if{" "}
          <MathJax inline={true}>{"\\(p\\)"}</MathJax> lies inside the triangle.
          We can first compute the normals{" "}
          <MathJax inline={true}>{"\\(n_{1}, n_{2}, n_{3}\\)"}</MathJax>:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/part1/point_in_poly.svg")}
            alt="point_in_poly"
            width="300"
            height="200"
          />
        </ImageContainer>
        <p>
          We also calculate the vectors going towards point{" "}
          <MathJax inline={true}>{"\\(p\\)"}</MathJax>. So we just have to check
          if <MathJax inline={true}>{"\\(p\\)"}</MathJax> lies on the left of
          each oriented half-plane given by the requirement that:{" "}
          <MathJax>
            {"\\begin{equation*} v_{i} \\cdot n_{i} \\leq 0 \\end{equation*}"}
          </MathJax>{" "}
          This means that drawing triangles to the frame buffer starts by
          computing the bounding box, and iterating through the rows and columns
          to perform this check. Here are some results:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/part1/dragon.png")}
            alt="dragon"
            width="1600"
            height="1200"
          />
          <Image
            src={path.join(mediaBase, "/part1/triangles.png")}
            alt="triangles"
            width="1600"
            height="1200"
          />
          <Image
            src={path.join(mediaBase, "/part1/cube.png")}
            alt="cube"
            width="1600"
            height="1200"
          />
          <Image
            src={path.join(mediaBase, "/part1/petals.png")}
            alt="petals"
            width="1600"
            height="1200"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Supersampling",
    content: (
      <div>
        <h2>Supersampling</h2>
        <p>
          Two of the images in the previous section contain a major flaw related
          to aliasing. Because we do not sample at a high enough rate, jaggies
          on the triangles and edges of the cube are visible:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/part2/triangle_jaggies.png")}
            alt="triangles jaggies"
            width="1600"
            height="1200"
          />
          <Image
            src={path.join(mediaBase, "/part2/cube_jaggies.png")}
            alt="cube jaggies"
            width="1600"
            height="1200"
          />
        </ImageContainer>
        <p>
          To fix this, we increase the sample rate from 1 sample per pixel. This
          means expanding the sample buffer, to account for our new samples,
          running the point in triangle check, and downsampling by averaging the
          values in each pixel to go from sample buffer to frame buffer:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/part2/supersampling.svg")}
            alt="supersampling"
            width="300"
            height="200"
          />
        </ImageContainer>
        <p>
          The resulting edges of the triangles are smoother and jaggies become
          less of an issue. Hover over the images to zoom in:
        </p>
        <ImageContainer columns={4}>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/triangle_jaggies.png")}
              alt="triangle_jaggies"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 1</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/triangle_super_4.png")}
              alt="triangle_super_4"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 4</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/triangle_super_9.png")}
              alt="triangle_super_9"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 9</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/triangle_super_16.png")}
              alt="triangle_super_16"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 16</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/cube_jaggies.png")}
              alt="cube_jaggies"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 1</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/cube_super_4.png")}
              alt="cube_super_4"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 4</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/cube_super_9.png")}
              alt="cube_super_9"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 9</figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part2/cube_super_16.png")}
              alt="cube_super_16"
              width="1600"
              height="1200"
            />
            <figcaption>Sample Rate: 16</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Transforms",
    content: (
      <div>
        <h2> Transforms </h2>
        <p>
          To draw various triangles at different locations, we can utilize
          transforms to rotate, scale, and translate a triangle. This is known
          as an affine transformation and can be broken down by:{" "}
          <MathJax>
            {
              "\\begin{equation*} \\begin{bmatrix} R & T \\\\ 0 & 1  \\end{bmatrix} \\end{equation*} "
            }
          </MathJax>
          Where the top left matrix is the rotation matrix and to the right is
          the translation matrix.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/part3/transforms.png")}
            alt="Transforms demo"
            width="1600"
            height="1200"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Barycentric Coordinates",
    content: (
      <div>
        <h2>Barycentric Coordinates</h2>
        <p>
          Through barycentric coordinates, we have a nice way of interpolating
          across the plane of a triangle. Given the points{" "}
          <MathJax inline={true}>{"\\(p_1, p_2, p_3\\)"}</MathJax> of a
          triangle, we can represent any point in the interior of the triangle
          as a linear combination of these points. With weights{" "}
          <MathJax inline={true}>{"\\(w_1, w_2, w_3\\)"}</MathJax>, we would
          just require that
          <MathJax>
            {"\\begin{equation*} w_1 + w_2 + w_3 = 1\\end{equation*}"}
          </MathJax>
          and
          <MathJax>
            {"\\begin{equation*}w_1, w_2, w_3 \\geq 0\\end{equation*}"}
          </MathJax>
          This means that we can use these weights to interpolate color across
          the plane of a triangle, where if a point{" "}
          <MathJax inline={true}>
            {"\\(p = w_1p_1 + w_2p_2 + w_3p_3\\)"}
          </MathJax>{" "}
          were inside the triangle, its color value would be:{" "}
          <MathJax inline={true}>{"\\(w_1c_1 + w_2c_2 + w_3c_3\\)"}</MathJax>
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/part4/barycentric.png")}
            alt="barycentric interp for triangle"
            width="1600"
            height="1200"
          />
          <Image
            src={path.join(mediaBase, "/part4/color_wheel.png")}
            alt="Color wheel with barycentric interpolation"
            width="1600"
            height="1200"
          />
        </ImageContainer>
        <p>
          Where <MathJax inline={true}>{"\\(c_1, c_2, c_3\\)"}</MathJax> are the
          colors corresponding to vertices{" "}
          <MathJax inline={true}>{"\\(p_1, p_2, p_3\\)"}</MathJax>
        </p>
      </div>
    ),
  },
  {
    id: "Sampling Pixels from Textures",
    content: (
      <div>
        <h2>Sampling Pixels for Texture Mapping</h2>
        <p>
          To map textures onto triangles, we can use the{" "}
          <MathJax inline={true}>{"\\(uv\\)"}</MathJax>-coordinate system. Both{" "}
          <MathJax inline={true}>{"\\(u, v\\)"}</MathJax> represent the
          coordinates of points on the texture, which scale from 0 to 1, and
          represents the normalized scaling of the texture. Since the vertices
          of the triangle are each assigned a{" "}
          <MathJax inline={true}>{"\\(uv\\)"}</MathJax> coordinate, we can
          perform barycentric interpolation to find the{" "}
          <MathJax inline={true}>{"\\(uv\\)"}</MathJax> coordinate of every
          vertex inside the triangle. And to find the color of the pixel, we
          would just perform sampling on the texture given the uv coordinates.
        </p>
        <h3> Nearest Neighbor Filtering</h3>
        <p>
          In nearest neighbor filtering, given the four closest pixels to the{" "}
          <MathJax inline={true}>{"\\(uv\\)"}</MathJax>-coordinate (scaled up to
          height/width of texture), we would choose the closest pixel and return
          the color of that pixel for our texture mapping.
        </p>
        <ImageContainer columns={2}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part5/earth_flat_nearest_1.png")}
              alt="flat earth nearest neighbor sampling"
              width="1600"
              height="1200"
            />
            <figcaption>NN sampling, Sample rate: 1</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part5/earth_rounded_nearest_16.png")}
              alt="rounded earth bilinear sampling"
              width="1600"
              height="1200"
            />
            <figcaption>NN sampling, Sample rate: 16</figcaption>
          </Figure>
        </ImageContainer>
        <h3>Bilinear Filtering</h3>
        <p>
          In bilinear filtering, we consider the 4 closest pixels to our sample
          point. Then along both axis, we perform a linear interpolation between
          the colors in each axis.
        </p>
        <ImageContainer columns={2}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part5/earth_flat_bilinear_1.png")}
              alt="flat earth nearest neighbor sampling"
              width="1600"
              height="1200"
            />
            <figcaption> Bilinear filtering, Sample rate: 1 </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part5/earth_rounded_bilinear_16.png")}
              alt="rounded earth bilinear sampling"
              width="1600"
              height="1200"
            />
            <figcaption> Bilinear filtering, Sample rate: 16</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Mipmap sampling",
    content: (
      <div>
        <h2> Level Sampling with Mipmaps</h2>
        <h3> Overview </h3>
        <p>
          Another anti-aliasing technique we can add on top of the previous ones
          is level sampling, in which for objects far away, we can sample from a
          lower resolution texture. This relieves the problem of failing the
          sample high frequencies for objects far away in which there are not
          enough pixels to sample into.
        </p>
        <p>
          To do this, we compute the partials of the{" "}
          <MathJax inline={true}>{"\\(uv\\)"}</MathJax>-coordinates with respect
          to <MathJax inline={true}>{"\\(xy\\)"}</MathJax>-coordinates, and base
          the resolution of the texture we want to sample from off of that. This
          just means that if the triangle we are rasterizing is large with
          respect to our texture, we want to sample from a full resolution
          texture, while if the triangle is small wrt to the texture, we want to
          sample from a downsampled texture.
        </p>
        <h3> Implementation </h3>
        <p>
          As for the implementation details, we compute the barycentric
          coordinates for{" "}
          <MathJax inline={true}>
            {"\\((x, y), (x + 1, y), (x, y + 1)\\)"}
          </MathJax>{" "}
          in our triangle to rasterize and apply the interpolation to get the
          cooresponding <MathJax inline={true}>{"\\(uv\\)"}</MathJax>
          -coordinates,{" "}
          <MathJax inline={true}>
            {"\\((u, v), (u_x, v_x), (u_y, v_y)\\)"}
          </MathJax>
          . We see that{" "}
          <MathJax inline={true}>{"\\((x + 1, y) - (x, y)\\)"}</MathJax> gives a
          1 unit change in the <MathJax inline={true}>{"\\(x\\)"}</MathJax>{" "}
          direction, so{" "}
          <MathJax inline={true}>{"\\((u_x, v_x) - (u, v)\\)"}</MathJax> gives
          the change in <MathJax inline={true}>{"\\(u, v\\)"}</MathJax> with
          respect to <MathJax inline={true}>{"\\(x\\)"}</MathJax>. We do the
          same with respect to <MathJax inline={true}>{"\\(y\\)"}</MathJax>, and
          compute{" "}
          <MathJax>
            {
              "\\begin{equation*}L = \\max\\left(\\sqrt{\\left(\\dfrac{du}{dx}\\right)^{2} + \\left(\\dfrac{dv}{dx}\\right)^{2}}, \\sqrt{\\left(\\dfrac{du}{dy}\\right)^{2} + \\left(\\dfrac{dv}{dy}\\right)^{2}}\\right) \\end{equation*}"
            }
          </MathJax>
          Then to get the level of the mip map, we take the log of this value:
          <MathJax>
            {"\\begin{equation*} d = \\log_{2}{L} \\end{equation*}"}
          </MathJax>
        </p>
        <ImageContainer columns={2}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part6/L0PN.png")}
              alt="Level 0 Pixel sampling nearest"
              width="1600"
              height="1200"
            />
            <figcaption> Level: 0, Pixel Sampling: Nearest</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part6/L0PL.png")}
              alt="Level 0 Pixel sampling bilinear"
              width="1600"
              height="1200"
            />
            <figcaption> Level: 0, Pixel Sampling: Bilinear</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part6/LNPN.png")}
              alt="Level Nearest Pixel sampling nearest"
              width="1600"
              height="1200"
            />
            <figcaption> Level: Nearest, Pixel Sampling: Nearest</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/part6/LNPL.png")}
              alt="Level Nearest Pixel sampling bilinear"
              width="1600"
              height="1200"
            />
            <figcaption> Level: Nearest, Pixel Sampling: Bilinear</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          It is difficult to see the difference across the level sampling
          methods, but the effect is more noticeable when we zoom out, as
          aliasing becomes a problem. Hover over the following three images to
          zoom in:
        </p>
        <ImageContainer columns={3}>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part6/L0.png")}
              alt="Level Zero"
              width="1600"
              height="1200"
            />
            <figcaption> Level Zero </figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part6/LN.png")}
              alt="Level Nearest"
              width="1600"
              height="1200"
            />
            <figcaption> Level Nearest </figcaption>
          </Figure>
          <Figure>
            <Image
              className="zoom-in"
              src={path.join(mediaBase, "/part6/LL.png")}
              alt="Level linear"
              width="1600"
              height="1200"
            />
            <figcaption> Level Linear </figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Project 1: The Rendering Pipeline</h1>
        <p>(https://trustinn.github.io/projects/ComputerGraphics/Project1)</p>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link}>
                  {article.content}
                </Article>
              </Section>
            ))}
          </SectionContainer>
          <Sidebar ids={pageContent.map((content) => content.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}
