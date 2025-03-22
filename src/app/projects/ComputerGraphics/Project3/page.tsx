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

const base = "/projects/ComputerGraphics/Project3";
const mediaBase = path.join(base, "media");
const imgWidth = 800;
const imgHeight = 600;

const pageContent: articleElem[] = [
  {
    id: "Overview",
    content: (
      <div>
        <h2> Overview </h2>
        <p>
          In this project, I have implemented methods simulate light in a scene
          and have explored ways to speed this up using a bounding volume
          hierarchy. From completing this assignment, I got a better grasp of
          how light interacts with objects and how different materials are
          rendered.
        </p>
      </div>
    ),
  },
  {
    id: "Ray Generation and Scene Intersection",
    content: (
      <div>
        <h2>Ray Generation and Scene Intersection </h2>
        <p>
          To generate the camera rays for our scene, we normalize our image
          coordinates which we use to calculate the rays from the camera based
          on the vertical and horizontal field of views. The bottom left corner
          of the camera sensor is given by
          <MathJax>
            {
              "\\begin{equation*} bl = \\left(-\\tan\\frac{hFov}{2}, -\\tan\\frac{vFov}{2} \\right) \\end{equation*}"
            }
          </MathJax>
          and for the top right, we get:
          <MathJax>
            {
              "\\begin{equation*} tr = \\left(\\tan\\frac{hFov}{2}, \\tan\\frac{vFov}{2} \\right) \\end{equation*}"
            }
          </MathJax>
          So if we have a point <MathJax inline={true}>{"\\(x, y\\)"}</MathJax>{" "}
          on the image, it would be a linear interpolation between the bottom
          left point and top right:
          <MathJax>
            {
              "\\begin{equation*}bl + (x(tr - bl)[0], y(tr - bl)[1]) \\end{equation*}"
            }
          </MathJax>
        </p>
        <p>
          Next would be intersection the ray with various objects in the scene.
          The first intersection test would be with a triangle, and the method I
          used included solving a system of equations for the barycentric
          coordinates of a potential intersection point. This is known as the
          Moller-Trumbore algorithm, and we can recover the coefficients by
          solving the system:
          <MathJax>
            {
              "\\begin{equation*}\\begin{bmatrix}\\mid & \\mid & \\mid \\\\-D & (p_{2}-p_{1}) & (p_{3}-p_{1}) \\\\ \\mid & \\mid & \\mid \\end{bmatrix}\\begin{bmatrix} t \\\\ u \\\\ v \\end{bmatrix} = r.o - p_{1} \\end{equation*}"
            }
          </MathJax>
          From this system, we get{" "}
          <MathJax inline={true}>{"\\(t, u, v\\)"}</MathJax>, and for the last
          barycentric value, we can take{" "}
          <MathJax inline={true}>{"\\(1 - u - v\\)"}</MathJax>. To check that
          the ray intersects the object, we require that{" "}
          <MathJax inline={true}>{"\\(t >= 0\\)"}</MathJax> and that there were
          no objects closer to the ray that the ray has already intersected
          with. So we also need{" "}
          <MathJax inline={true}>{"\\(t <= r.max_t\\)"}</MathJax>.
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "part1/CBempty.png")}
            width={imgWidth}
            height={imgHeight}
            alt="Triangle ray intersection render"
          />
          <Image
            src={path.join(mediaBase, "part1/CBcoil.png")}
            width={imgWidth}
            height={imgHeight}
            alt="Coil render"
          />
        </ImageContainer>
        <p>
          We can also calculate the intersection of rays with sphere since we
          have the formula for both. The formula for a sphere is:
          <MathJax>
            {"\\begin{equation*}\\lVert v - s.c \\rVert = s.r\\end{equation*}"}
          </MathJax>
          And for a ray:
          <MathJax>
            {"\\begin{equation*} v = r.o + r.d \\cdot t \\end{equation*}"}
          </MathJax>
          Then substituting in <MathJax inline={true}>{"\\(v\\)"}</MathJax> into
          the sphere equation, we get a quadratic equation and can solve for{" "}
          <MathJax inline={true}>{"\\(t\\)"}</MathJax> with the quadratic
          formula:
          <MathJax inline={true}>
            {
              "\\begin{align*} a &= dot(r.d, r.d)                       \\\\ b &= 2 * dot(s.c - r.o, r.d)             \\\\ c &= dot(s.c - r.o, s.c - r.o) - s.r^{2}   \\end{align*} "
            }
          </MathJax>
          We check for a nonnegative determinant to get solutions and here is
          the result of the ray intersection with a sphere:
          <ImageContainer className="max-w-[30rem]">
            <Image
              src={path.join(mediaBase, "part1/CBspheres.png")}
              width={imgWidth}
              height={imgHeight}
              alt="Sphere ray intersection render"
            />
          </ImageContainer>
        </p>
      </div>
    ),
  },
  {
    id: "Bounding Volume Hierarchy",
    content: (
      <div>
        <h2> Bounding Volume Hierarchy </h2>
        <p>
          In a bvh, we store objects and their bounding boxes. When we construct
          our tree out of these bounding boxes, we split the bounding boxes into
          a left and right set and call our constructor on the left and right
          set. We continue dividing the bounding boxes until there are less than
          max_children objects in the current set. A bvh allows us to
          efficiently prune off objects in the tree that we know do not
          intersect with our ray when we start raytracing.
        </p>
        <p>
          The split method I used was computing the averages of the centroids of
          each bounding box. I then iterate over each dimension computing the
          splits in each. So for dimensions{" "}
          <MathJax inline={true}>{"\\(x, y, z\\)"}</MathJax>, I would get sets{" "}
          <MathJax inline={true}>{"\\(l, r\\)"}</MathJax>. Then the cost given
          to the split is:
          <MathJax>
            {
              "\\begin{equation*}\\text{SA}(l) \\cdot \\text{l.size}() + \\text{SA}(r) \\cdot \\text{r.size}()\\end{equation*}"
            }
          </MathJax>
          The dimension that gives the lowest cost is chosen. At a high level,
          this computes the cost of raytracing, as the probability of a ray
          hitting a box is proportional to the box&apos;s surface area, and the
          cost of traversal is equal to the number of items in the box.
        </p>
        <p>
          The objects in the bvh were stored in a flat array, and the current
          objects in our node are represented by a start and end pointer to a
          continuous segement. So to split, we sort this array similar to
          inplace quicksorting, then recurse given a left, right partition.
        </p>
        <p>
          Finally, here are some renders of scenes with a large number of
          objects:
        </p>
        <ImageContainer columns={3}>
          {["blob", "blucy", "dragon"].map((name, i) => {
            const unifPath = path.join(mediaBase, `part2/${name}.png`);
            return (
              <Figure key={i}>
                <Image
                  className="zoom-in"
                  src={unifPath}
                  alt={`${name} default shading with bounding volume hierarchy`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> {name}, bvh, default shading </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Direct Illumination",
    content: (
      <div>
        <h2> Direct Illumination </h2>
        <p>
          Direct Illumination refers to the incoming light onto a surface from a
          light source without indirect bounces. When calculating the
          illumination an object recieves, we consider the angle of the incoming
          ray, the bsdf function that describes the surface (ratio/distribution
          of incoming light to outgoing light), and finally, the actual luminous
          power and color the ray carries.
        </p>
        <h3> Zero-bounce Illumination </h3>
        <p>
          In zero-bounce illumination, from a given ray w_in, we would compute
          the intersection of that ray with our scene. The object that it
          intersects with gives an emission, which is what I returned from the
          function.
        </p>
        <h3> Direct Lighting with Uniform Hemisphere Sampling</h3>
        <p>
          To implement uniform hemisphere sampling for lighting, I sampled for
          vectors in the hemisphere of the origin point of the ray. Then for
          each sample, I compute the ray&apos;s intersection with the scene, and
          we can get the illumination by:
          <MathJax>
            {
              "\\begin{equation*}\\text{isect.bsdf}\\rightarrow\\text{get_emission()} \\cdot \\text{cos_theta(w_in)} \\cdot \\text{bsdf}\\rightarrow\\text{f(w_out, w_in)}\\end{equation*}"
            }
          </MathJax>
          Here are some examples:
        </p>
        <ImageContainer columns={3}>
          {["bunny", "coil", "dragon"].map((name, i) => {
            const unifPath = path.join(
              mediaBase,
              `part3/uniform/${name}_64_32.png`,
            );
            return (
              <Figure key={i}>
                <Image
                  className="zoom-in"
                  src={unifPath}
                  alt={`${name}, uniform sampling`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> {name} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <h3> Direct Lighting by Importance Sampling Lights </h3>
        <p>
          For importance sampling, we iterate over each light and sample from it{" "}
          <MathJax inline={true}>{"\\(n\\)"}</MathJax> times. After sampling
          from the light, we set the ray&apos;s <code>min_t</code> to{" "}
          <code>EPS_F</code> and <code> max_t</code> to{" "}
          <code>distToLight - EPS_F</code> to check if there are any scene
          objects between the light and surface that would block the light. If
          not, we compute the illumination similar to above and take the average
          out of those <MathJax inline={true}>{"\\(n\\)"}</MathJax> samples.
          Since we do not sample uniformly, we need to divide our sample by the
          probability of making that sample. Finally, summing the illumination
          over all light sources gives us the lighting from importance sampling.
        </p>
        <ImageContainer columns={3}>
          {["bunny", "coil", "dragon"].map((name, i) => {
            const impPath = path.join(
              mediaBase,
              `part3/importance/${name}_64_32.png`,
            );
            return (
              <Figure key={i}>
                <Image
                  className="zoom-in"
                  src={impPath}
                  alt={`${name}, importance sampling`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> {name} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          Here is an example of increasing the amount of samples we draw from
          each light source:
        </p>
        <ImageContainer columns={2}>
          {[1, 4, 16, 64].map((num) => {
            const imgPath = path.join(
              mediaBase,
              `part3/l_samples/coil_1_${num}.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  src={imgPath}
                  alt={`Coil with ${num} light samples`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> Coil, light {num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          A difference between uniform sampling and importance sampling would be
          the amount of noise in the image. With importance sampling, we sample
          directly from the light source, which allows us to converge faster to
          the solution. From the images above, the ones obtained from uniform
          sampling are grainier, with much more variation in the color on each
          wall compared to importance sampling.
        </p>
      </div>
    ),
  },
  {
    id: "Global Illumination",
    content: (
      <div>
        <h2> Global Illumination </h2>
        <p>
          For indirect lighting, we would use a recursive function and trace a
          ray to a surface. If the ray&apos;s depth was 1, we would just return
          the one bounce illumination from the previous part. Otherwise, we
          sample a ray on the hemisphere, translated to world coordinates,
          recurse using the function. Since the function returns incoming light,
          we would multiply by the bsdf and cos_theta for the angle, giving the
          illumination of the surface.
        </p>
        <p>
          This is the illumination where we do not accumulate the illumination
          from previous bounces:
        </p>
        <ImageContainer columns={3}>
          {[0, 1, 2, 3, 4, 5].map((num) => {
            const imgPath = path.join(
              mediaBase,
              `part4/bunnyNAcc/bunny-M${num}-NAcc.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imgPath}
                  alt={`Luminance with num_ray_bounces = ${num}`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> depth = {num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p> And this is with isAccumBounces enabled:</p>
        <ImageContainer columns={3}>
          {[0, 1, 2, 3, 4, 5].map((num) => {
            const imgPath = path.join(
              mediaBase,
              `part4/bunnyAcc/bunny-M${num}-Acc.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imgPath}
                  alt={`Accumulated bounces with max_ray_depth = ${num}`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> m_depth = {num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          When the light is not accumulated, with more bounces, it loses
          brightness, and this makes sense because the light is scattered when
          it comes in contact with a surface. When the light is accumulated, the
          scene becomes brighter, because many areas are more likely to come in
          contact with light rays when we allow for more bounces.
        </p>
        <p>
          We can also split the rendering into direct and indirect lighting.
          Something interesting to note is that with direct lighting, we get the
          base color of the object while indirect lighting captures more of the
          reflective properties of the object:
        </p>
        <ImageContainer columns={3}>
          {["original", "direct", "indirect"].map((desc) => {
            const imgPath = path.join(
              mediaBase,
              `part4/dragon/dragon-${desc}.png`,
            );
            return (
              <Figure key={desc}>
                <Image
                  className="zoom-in"
                  src={imgPath}
                  alt={`Dragon rendered with ${desc} lighting`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> {desc} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <p>
          Finally, this shows spheres rendered with a varying number of
          samples-per-pixel:
        </p>
        <ImageContainer columns={4}>
          {[1, 2, 4, 8, 16, 64, 1024].map((num) => {
            const imgPath = path.join(
              mediaBase,
              `part4/spheres/spheres-S${num}.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imgPath}
                  alt={`Spheres rendered with ${num} samples per pixel`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> {num} spp </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
        <h2> Russian Roulette </h2>
        <p>
          Computing the global illumination requires us to sum over all the{" "}
          <MathJax inline={true}>{"\\(k\\)"}</MathJax>-bounces of light through
          a scene for <MathJax inline={true}>{"\\(k \\geq 0\\)"}</MathJax>. An
          unbiased solution to this problem involves flipping a coin with weight{" "}
          <MathJax inline={true}>{"\\(cpdf\\)"}</MathJax> to check whether the
          ray should continue bouncing. If it does, we calculate the incoming
          light and divide that additionally by the{" "}
          <MathJax inline={true}>{"\\(cpdf\\)"}</MathJax>. If not, we return the
          one bounce illumination function as the base case.
        </p>
        <ImageContainer columns={3}>
          {[0, 1, 2, 3, 4, 100].map((num) => {
            const imgPath = path.join(
              mediaBase,
              `part4/bunnyRR/bunny-M${num}-RR.png`,
            );
            return (
              <Figure key={num}>
                <Image
                  className="zoom-in"
                  src={imgPath}
                  alt={`Russian roulette bunny scene with max_ray_depth = ${num}`}
                  width={imgWidth}
                  height={imgHeight}
                />
                <figcaption> m_depth = {num} </figcaption>
              </Figure>
            );
          })}
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Adaptive Sampling",
    content: (
      <div>
        <h2>Adaptive Sampling</h2>
        <p>
          In adaptive sampling, we check that the margin of error is less than a
          given tolerance. So given <MathJax inline={true}>{"\\(n\\)"}</MathJax>{" "}
          samples, I calculated the illumination of the sample, the average
          illumination and variance of illumination. Then{" "}
          <MathJax>
            {
              "\\begin{equation*}I = 1.96 \\cdot \\sqrt{\\frac{\\sigma^2}{n}}\\end{equation*}"
            }
          </MathJax>
          and I checked for every <MathJax inline={true}>{"\\(32\\)"}</MathJax>{" "}
          samples if{" "}
          <MathJax inline={true}>
            {"\\(I \\leq maxTolerance \\cdot \\mu \\)"}
          </MathJax>{" "}
          which would be the condition to stop. Here are some results:
        </p>
        <ImageContainer columns={3}>
          {["bunny", "coil", "dragon"].map((name) => {
            const imgPath = path.join(mediaBase, `part5/${name}-adp.png`);
            const ratePath = path.join(mediaBase, `part5/${name}-adp_rate.png`);
            return (
              <div key={name}>
                <Figure>
                  <Image
                    className="zoom-in"
                    src={imgPath}
                    alt={`Adaptive sampling of ${name}`}
                    width={imgWidth}
                    height={imgHeight}
                  />
                  <figcaption> {name} S=2048 M=5 </figcaption>
                </Figure>
                <Figure>
                  <Image
                    className="zoom-in"
                    src={ratePath}
                    alt={`Adaptive sampling rate of ${name}`}
                    width={imgWidth}
                    height={imgHeight}
                  />
                  <figcaption> {name} sampling rate </figcaption>
                </Figure>
              </div>
            );
          })}
        </ImageContainer>
        <p>
          With adaptive sampling, parts of the scene that are not directly
          visible to the light are sampled more. For instance, the shadow of the
          bunny and coil are red, while the walls are blue.
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Project 3: Ray Tracing and Illumination</h1>
        <p>(https://trustinn.github.io/projects/ComputerGraphics/Project3)</p>
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
