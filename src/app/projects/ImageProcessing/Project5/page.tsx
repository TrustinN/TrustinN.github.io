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
import type { articleElem } from "@/components/ContentContainer";
import { Sidebar } from "@/components/Sidebar";

import { Figure, ImageContainer } from "@/components/ImageContainer";
import Image from "next/image";
import { MathJax } from "better-react-mathjax";

const base = "/projects/ImageProcessing/Project5/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Forward Process",
    content: (
      <div>
        <h2>Forward Process</h2>
        <p>
          In the forward process, an image is denoised by subtracting away the
          noise that is predicted to be in the image. For diffusion, the model
          is trained on the noise given by:
          <MathJax>
            {
              "\\begin{equation*} \\mathcal{N}(0, \\sqrt{1 - \\overline{\\alpha}}) \\end{equation*}"
            }
          </MathJax>
          Adding this noise to our base image{" "}
          <MathJax inline={true}>
            {
              "\\begin{equation*} \\sqrt{\\overline{\\alpha}} \\cdot x_0 \\end{equation*}"
            }
          </MathJax>{" "}
          gives the noisy image that the network sees at{" "}
          <MathJax inline={true}>{"\\(\\alpha\\)"}</MathJax>, the interpolation
          factor. Here, <MathJax inline={true}>{"\\(\\alpha\\)"}</MathJax> is
          determined by a schedule, and we obtain it by{" "}
          <MathJax inline={true}>{"\\(\\alpha[t]\\)"}</MathJax> where{" "}
          <MathJax inline={true}>{"\\(t\\)"}</MathJax> is the timestep{" "}
          <MathJax inline={true}>{"\\(t \\in [0, 999]\\)"}</MathJax>. Here are
          some results of generating the noisy image:
        </p>
        <ImageContainer columns={4}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/camp_clean.png")}
              width="64"
              height="64"
              alt="Campanile Noise t0"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 0\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/noise_t250.png")}
              width="64"
              height="64"
              alt="Campanile Noise t250"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 250\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/noise_t500.png")}
              width="64"
              height="64"
              alt="Campanile Noise t500"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 500\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/noise_t750.png")}
              width="64"
              height="64"
              alt="Campanile Noise t750"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 750\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Denoising",
    content: (
      <div>
        <h2>Denoising</h2>
        <h3>Classic Denoising</h3>
        <p>
          In classic denoising, we attempt to hide irregularities in the image
          through some averaging/smoothing filter such as the gaussian filter.
          By pulling data from neighboring pixels, we can decrease the impact of
          noise on the image. This does well when there is little noise, but
          fails at high noise levels, which is seen in all three attempts.
        </p>
        <ImageContainer columns={4}>
          <Image
            src={path.join(mediaBase, "/camp_clean.png")}
            width="64"
            height="64"
            alt="Campanile Noise t0"
          />
          <Image
            src={path.join(mediaBase, "/gaussian/noise_t250.png")}
            width="64"
            height="64"
            alt="Campanile Noise t250"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/gaussian/noise_t500.png")}
            width="64"
            height="64"
            alt="Campanile Noise t500"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/gaussian/noise_t750.png")}
            width="64"
            height="64"
            alt="Campanile Noise t750"
            loading="lazy"
          />
          <Figure>
            <Image
              src={path.join(mediaBase, "/camp_clean.png")}
              width="64"
              height="64"
              alt="Campanile Noise t0"
            />
            <figcaption>Original</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/clean_t250.png")}
              width="64"
              height="64"
              alt="Campanile Clean t250"
              loading="lazy"
            />
            <figcaption>
              Denoise <MathJax inline={true}>{"\\(t = 250\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/clean_t500.png")}
              width="64"
              height="64"
              alt="Campanile Clean t500"
              loading="lazy"
            />
            <figcaption>
              Denoise <MathJax inline={true}>{"\\(t = 500\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/clean_t750.png")}
              width="64"
              height="64"
              alt="Campanile Clean t750"
              loading="lazy"
            />
            <figcaption>
              Denoise <MathJax inline={true}>{"\\(t = 750\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
        <h3>One-Step Denoising</h3>
        <p>
          In one step denoising, we feed in the noisy image and the current
          timestep, and the model recovers the amount of noise that is predicted
          to be in the image. Recall that we used the equation:{" "}
          <MathJax>
            {
              "\\begin{equation*} x_{t} = \\sqrt{\\overline{\\alpha}} \\cdot x_{0} + \\sqrt{1 - \\overline{\\alpha}} \\cdot \\epsilon \\end{equation*}"
            }
          </MathJax>{" "}
          for the forward process. So we can recover the original image{" "}
          <MathJax inline={true}>{"\\(x_0\\)"}</MathJax> by:
          <MathJax>
            {
              "\\begin{equation*} x_{0} = \\dfrac{x_{t} - \\sqrt{1 - \\overline{\\alpha}} \\cdot \\epsilon}{\\sqrt{\\overline{\\alpha}}} \\end{equation*}"
            }
          </MathJax>
        </p>
        <ImageContainer columns={4}>
          <Image
            src={path.join(mediaBase, "/camp_clean.png")}
            width="64"
            height="64"
            alt="Campanile Noise t0"
          />
          <Image
            src={path.join(mediaBase, "/one_step/noise_t250.png")}
            width="64"
            height="64"
            alt="Campanile Noise t250"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/one_step/noise_t500.png")}
            width="64"
            height="64"
            alt="Campanile Noise t500"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/one_step/noise_t750.png")}
            width="64"
            height="64"
            alt="Campanile Noise t750"
            loading="lazy"
          />
          <Figure>
            <Image
              src={path.join(mediaBase, "/camp_clean.png")}
              width="64"
              height="64"
              alt="Campanile Noise t0"
            />
            <figcaption>Original</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/one_step/clean_t250.png")}
              width="64"
              height="64"
              alt="Campanile Clean t250"
              loading="lazy"
            />
            <figcaption>
              Denoise: <MathJax inline={true}>{"\\(t = 250\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/one_step/clean_t500.png")}
              width="64"
              height="64"
              alt="Campanile Clean t500"
              loading="lazy"
            />
            <figcaption>
              Denoise: <MathJax inline={true}>{"\\(t = 500\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/one_step/clean_t750.png")}
              width="64"
              height="64"
              alt="Campanile Clean t750"
              loading="lazy"
            />
            <figcaption>
              Denoise: <MathJax inline={true}>{"\\(t = 750\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
        <p>
          This does much better than the low-pass filter, but the image is till
          blurry compared to the original. For example, the trees have lost
          their texture and takes on a flat green texture.
        </p>
        <h3>Iterative Denoising</h3>
        <p>
          In iterative denoising, rather than subtracting all noise out in one
          step, we subtract a little bit of noise over many steps and repredict
          the next amount of noise. The process is sped up by taking strided
          timesteps and the new formula is given by:
          <MathJax>
            {
              "\\begin{equation*} x_{t^{\\prime}} =\\dfrac{\\sqrt{\\overline{\\alpha_{t^{\\prime}}}}\\beta_{t}}{1 - \\overline{\\alpha}_{t}}x_{0} + \\dfrac{\\sqrt{\\alpha_{t}}(1 - \\overline{\\alpha}_{t^{\\prime}})}{1 - \\overline{\\alpha_{t}}}x_{t} + v_{\\sigma}\\end{equation*}"
            }
          </MathJax>{" "}
          The values are given by:
        </p>

        <ul className="ml-8">
          <li>
            <MathJax inline={true}>{"\\(x_{t}\\)"}</MathJax> is the noisy image
            at time <MathJax inline={true}>{"\\(t\\)"}</MathJax>
          </li>
          <li>
            <MathJax inline={true}>{"\\(x_{t^{\\prime}}\\)"}</MathJax> is the
            noisy image at the next timestep
          </li>
          <li>
            <MathJax inline={true}>{"\\(\\overline{\\alpha}_{t}\\)"}</MathJax>{" "}
            is <MathJax inline={true}>{"\\(\\alpha[t]\\)"}</MathJax>
          </li>
          <li>
            <MathJax inline={true}>
              {
                "\\(\\alpha_{t} = \\frac{\\overline{\\alpha}_{t}}{\\overline{\\alpha_{t^{\\prime}}}}\\)"
              }
            </MathJax>
          </li>
          <li>
            <MathJax inline={true}>
              {"\\(\\beta_{t} = 1 - \\alpha_{t}\\)"}
            </MathJax>
          </li>
          <li>
            <MathJax inline={true}>{"\\(x_{0}\\)"}</MathJax> is the predicted
            clean image given by the one step formula
          </li>
        </ul>
        <ImageContainer columns={3}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_1.png")}
              width="64"
              height="64"
              alt="Campanile Iterative Denoise 1"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 690\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_2.png")}
              width="64"
              height="64"
              alt="Campanile Iterative Denoise 2"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 540\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_3.png")}
              width="64"
              height="64"
              alt="Campanile Iterative Denoise 3"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 390\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_4.png")}
              width="64"
              height="64"
              alt="Campanile Iterative Denoise 4"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 240\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_5.png")}
              width="64"
              height="64"
              alt="Campanile Iterative Denoise 5"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 90\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_iterative.png")}
              width="64"
              height="64"
              alt="Campanile Iterative Denoise 6"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 0\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
        <p>The resulting image looks sharper than the previous ones</p>
        <h3>A Comparison</h3>
        <ImageContainer columns={4}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/gaussian/clean_t750.png")}
              width="64"
              height="64"
              alt="Gaussian Denoise"
              loading="lazy"
            />
            <figcaption>Gaussian Denoise</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/one_step/clean_t750.png")}
              alt="One Step Denoise"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>One Step Denoise</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/iterative/camp_iterative.png")}
              alt="Iterative Denoise"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>Iterative Denoise</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/camp_clean.png")}
              alt="Campanile"
              width="64"
              height="64"
              loading="lazy"
            />

            <figcaption>Original</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          It is noticeable that gaussian denoising is not very effective when
          there is too much noise. So we have to go for nonlinear denoising
          methods, such as one step and iterative denoising.
        </p>
      </div>
    ),
  },
  {
    id: "Diffusion Sampling",
    content: (
      <div>
        <h2>Diffusion Model Sampling</h2>
        <p>
          We can also denoise pure noise, rather than starting from a noisy
          image. Here are $5$ results:
        </p>
        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/diff_sample/diff_sample_1.png")}
            alt="Diffusion Sample 1"
            width="64"
            height="64"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/diff_sample/diff_sample_2.png")}
            alt="Diffusion Sample 2"
            width="64"
            height="64"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/diff_sample/diff_sample_3.png")}
            alt="Diffusion Sample 3"
            width="64"
            height="64"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/diff_sample/diff_sample_4.png")}
            alt="Diffusion Sample 4"
            width="64"
            height="64"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/diff_sample/diff_sample_5.png")}
            alt="Diffusion Sample 5"
            width="64"
            height="64"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "CFG",
    content: (
      <div>
        <h2>Classifier Free Guidance</h2>
        <p>
          In CFG, the model uses conditional classification. We can generate two
          noise predictions off of our current image
          <MathJax inline={true}>
            {"\\(\\epsilon_{c}, \\epsilon_{u}\\)"}
          </MathJax>{" "}
          such that our new predicted noise is:{" "}
          <MathJax>
            {
              "\\begin{equation*} \\epsilon = (1 - \\gamma)\\epsilon_{u} + \\gamma \\epsilon_{c} \\end{equation*}"
            }
          </MathJax>{" "}
          This means that when{" "}
          <MathJax inline={true}>{"\\(\\gamma > 1\\)"}</MathJax> the noise
          prediction leans more towards using the conditional noise. From the
          small update the images become much more recognizable:
        </p>
        <ImageContainer columns={5}>
          <ImageContainer>
            <Figure>
              <Image
                className="dissolve"
                src={path.join(mediaBase, "/iterative_cfg/cfg1/denoise_8.png")}
                alt="iterative_cfg1_clean"
                width="64"
                height="64"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/iterative_cfg/cfg1/output.gif")}
                width="64"
                height="64"
                alt="iterative_cfg1_gif"
                loading="lazy"
              />
            </Figure>
          </ImageContainer>
          <ImageContainer>
            <Figure>
              <Image
                className="dissolve"
                src={path.join(mediaBase, "/iterative_cfg/cfg2/denoise_8.png")}
                alt="iterative_cfg2_clean"
                width="64"
                height="64"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/iterative_cfg/cfg2/output.gif")}
                alt="iterative_cfg2_gif"
                width="64"
                height="64"
                loading="lazy"
              />
            </Figure>
          </ImageContainer>
          <ImageContainer>
            <Figure>
              <Image
                className="dissolve"
                src={path.join(mediaBase, "/iterative_cfg/cfg3/denoise_8.png")}
                alt="iterative_cfg3_clean"
                width="64"
                height="64"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/iterative_cfg/cfg3/output.gif")}
                alt="iterative_cfg3_gif"
                width="64"
                height="64"
                loading="lazy"
              />
            </Figure>
          </ImageContainer>
          <ImageContainer>
            <Figure>
              <Image
                className="dissolve"
                src={path.join(mediaBase, "/iterative_cfg/cfg4/denoise_8.png")}
                alt="iterative_cfg4_clean"
                // onMouseOver="resetSiblingGif(this)"
                width="64"
                height="64"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/iterative_cfg/cfg4/output.gif")}
                alt="iterative_cfg4_gif"
                loading="lazy"
                width="64"
                height="64"
              />
            </Figure>
          </ImageContainer>

          <ImageContainer>
            <Figure>
              <Image
                className="dissolve"
                src={path.join(mediaBase, "/iterative_cfg/cfg5/denoise_8.png")}
                alt="iterative_cfg5_clean"
                // onMouseOver="resetSiblingGif(this)"
                width="64"
                height="64"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/iterative_cfg/cfg5/output.gif")}
                width="64"
                height="64"
                alt="iterative_cfg5_gif"
                loading="lazy"
              />
            </Figure>
          </ImageContainer>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Image Translation",
    content: (
      <div>
        <h2>Image to Image Translation</h2>
        <p>
          Rather than starting with random noise, we can start with a noisy base
          image and run iterative cfg to get variations from our base image.
          This is done by running the forward noising process and running the
          previous algorithm on the noisy image.
        </p>
        <ImageContainer columns={6}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/im_translation/t_1.png")}
              alt="Image Translation t1"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 1\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/im_translation/t_3.png")}
              alt="Image Translation t3"
              loading="lazy"
              width="64"
              height="64"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 3\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/im_translation/t_5.png")}
              alt="Image Translation t5"
              loading="lazy"
              width="64"
              height="64"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 5\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/im_translation/t_7.png")}
              alt="Image Translation t7"
              loading="lazy"
              width="64"
              height="64"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 7\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/im_translation/t_10.png")}
              alt="Image Translation t10"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 10\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/im_translation/t_20.png")}
              alt="Image Translation t20"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t = 20\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Hand-Drawn/Web Images",
    content: (
      <div>
        <h2>Editing Hand-Drawn/Web Images</h2>
        <p>We can also denoise hand-drawn and web images:</p>
        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/web_edits/t_1.png")}
            width="64"
            height="64"
            alt="Web Edit t1"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/web_edits/t_3.png")}
            width="64"
            height="64"
            alt="Web Edit t3"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/web_edits/t_5.png")}
            width="64"
            height="64"
            alt="Web Edit t5"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/web_edits/t_7.png")}
            width="64"
            height="64"
            alt="Web Edit t7"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/web_edits/t_10.png")}
            width="64"
            height="64"
            alt="Web Edit t10"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/web_edits/t_20.png")}
            width="64"
            height="64"
            alt="Web Edit t20"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/web_edits/original.png")}
            width="64"
            height="64"
            alt="Base Image"
            loading="lazy"
          />
        </ImageContainer>

        <ImageContainer columns={5}>
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/t_1.png")}
            width="64"
            height="64"
            alt="Hand-Drawn Edit t1"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/t_3.png")}
            width="64"
            height="64"
            alt="Hand-Drawn Edit t3"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/t_5.png")}
            width="64"
            height="64"
            alt="Hand-Drawn Edit t5"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/t_7.png")}
            width="64"
            height="64"
            alt="Hand-Drawn Edit t7"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/t_10.png")}
            width="64"
            height="64"
            alt="Hand-Drawn Edit t10"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/t_20.png")}
            width="64"
            height="64"
            alt="Hand-Drawn Edit t20"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/hand_drawn_edits/original.png")}
            width="64"
            height="64"
            alt="Base Image"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Inpainting",
    content: (
      <div>
        <h2>Inpainting</h2>
        <p>
          We can also inpaint an image given the work done so far. Rather than
          subtracting out the noise calculated at each step from our entire
          image, we only subtract out the calculated noise in a section of our
          image. This means that for all noise outside the area we want to
          inpaint, we replace it with the original image processed through the
          forward noising function.
        </p>
        <ImageContainer columns={5}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_1.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 1"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=990\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_2.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 2"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=840\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_3.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 3"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=690\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_4.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 4"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=540\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_5.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 5"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=390\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_6.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 6"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=240\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_7.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 7"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=90\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/inpainting/denoise_8.png")}
              width="64"
              height="64"
              alt="Campanile Inpaint 8"
              loading="lazy"
            />
            <figcaption>
              <MathJax inline={true}>{"\\(t=0\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Text Conditional Translation",
    content: (
      <div>
        <h2>Text Conditional Image to Image Translation</h2>
        <p>
          Rather than keeping the prompt set to &quot;a high quality
          photo&quot;, we can replace it with a text prompt from the prompt
          embedding. This means that rather than denoising unconditionally, we
          denoise based on the prompt given, which will give the image a push
          towards what is specified by the prompt.
        </p>
        <ImageContainer columns={6}>
          <Figure>
            <ImageContainer>
              <Image
                className="dissolve"
                src={path.join(
                  mediaBase,
                  "/text_conditioned/t_1/denoise_8.png",
                )}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_1"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/text_conditioned/t_1/output.gif")}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_1 gif"
                loading="lazy"
              />
            </ImageContainer>
            <figcaption>
              <MathJax inline={true}>{"\\(t = 1\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                className="dissolve"
                src={path.join(
                  mediaBase,
                  "/text_conditioned/t_2/denoise_8.png",
                )}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_2"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/text_conditioned/t_2/output.gif")}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_2 gif"
                loading="lazy"
              />
            </ImageContainer>
            <figcaption>
              <MathJax inline={true}>{"\\(t = 3\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                className="dissolve"
                src={path.join(
                  mediaBase,
                  "/text_conditioned/t_3/denoise_8.png",
                )}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_3"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/text_conditioned/t_3/output.gif")}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_3 gif"
                loading="lazy"
              />
            </ImageContainer>
            <figcaption>
              <MathJax inline={true}>{"\\(t = 5\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                className="dissolve"
                src={path.join(
                  mediaBase,
                  "/text_conditioned/t_4/denoise_7.png",
                )}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_4"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/text_conditioned/t_4/output.gif")}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_4 gif"
                loading="lazy"
              />
            </ImageContainer>
            <figcaption>
              <MathJax inline={true}>{"\\(t = 7\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                className="dissolve"
                src={path.join(
                  mediaBase,
                  "/text_conditioned/t_5/denoise_7.png",
                )}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_5"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/text_conditioned/t_5/output.gif")}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_5 gif"
                loading="lazy"
              />
            </ImageContainer>
            <figcaption>
              <MathJax inline={true}>{"\\(t = 10\\)"}</MathJax>
            </figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                className="dissolve"
                src={path.join(
                  mediaBase,
                  "/text_conditioned/t_6/denoise_5.png",
                )}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_6"
                // onMouseOver="resetSiblingGif(this)"
                loading="lazy"
              />
              <Image
                className="emerge"
                src={path.join(mediaBase, "/text_conditioned/t_6/output.gif")}
                width="64"
                height="64"
                alt="Campanile Translation Rocket t_6 gif"
                loading="lazy"
              />
            </ImageContainer>
            <figcaption>
              <MathJax inline={true}>{"\\(t = 20\\)"}</MathJax>
            </figcaption>
          </Figure>
        </ImageContainer>
        <p>
          We see that the images look more similar to the base image (Campanile)
          when we start off with less noise, but still resembles a rocket, which
          was the prompt embed used.
        </p>
      </div>
    ),
  },
  {
    id: "Visual Anagrams",
    content: (
      <div>
        <h2>Visual Anagrams</h2>
        <p>
          We can also flip the image at each step, denoise and flip it back to
          make a separate denoising step towards a different prompt embed. This
          allows us to make a flip illusion, where flipping the image reveals a
          hidden image. Hover over the images to visualize the result:
        </p>
        <ImageContainer columns={4}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/flip_illusion/i1/denoise_9.png")}
              alt="Flip Illusion Skull, Waterfall"
              width="64"
              height="64"
              className="flip"
              loading="lazy"
            />
            <figcaption className="dissolve">A Waterfall</figcaption>
            <figcaption className="emerge">A Skull</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/flip_illusion/i2/denoise_9.png")}
              alt="Flip Illusion Man, Campfire"
              width="64"
              height="64"
              className="flip"
              loading="lazy"
            />
            <figcaption className="dissolve">A Campfire</figcaption>
            <figcaption className="emerge">A Man</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/flip_illusion/i3/denoise_9.png")}
              alt="Flip Illusion Man with Hat, Campfire"
              width="64"
              height="64"
              className="flip"
              loading="lazy"
            />
            <figcaption className="dissolve">A Campfire</figcaption>
            <figcaption className="emerge">A Man Wearing a Hat</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/flip_illusion/i4/denoise_9.png")}
              alt="Flip Illusion Dog, Snow Mountain"
              width="64"
              height="64"
              className="flip"
              loading="lazy"
            />
            <figcaption className="dissolve">A Snowy Village</figcaption>
            <figcaption className="emerge">A Dog</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Hybrid Images",
    content: (
      <div>
        <h2>Hybrid Images</h2>
        <p>
          A hybrid image is one where one subject in an image dominates when
          viewed up close and a different one dominates when viewed afar. We can
          again modify the noise added, this time taking the low frequencies of
          the predicted noise from one prompt embedding and adding it to the
          high frequencies of a different prompt embedding. Hover over the
          images to see the result:
        </p>
        <ImageContainer columns={3}>
          <Figure>
            <Image
              src={path.join(
                mediaBase,
                "/hybrid/skull_waterfall/denoise_9.png",
              )}
              width="64"
              height="64"
              alt="Skull Waterfall hybrid"
              className="zoom-out"
              loading="lazy"
            />
            <figcaption className="dissolve">A Waterfall</figcaption>
            <figcaption className="emerge">A Skull</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/hybrid/skull_winter/denoise_9.png")}
              width="64"
              height="64"
              alt="Skull Snow Mountain hybrid"
              className="zoom-out"
              loading="lazy"
            />
            <figcaption className="dissolve">A Snow Mountain</figcaption>
            <figcaption className="emerge">A Skull</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/hybrid/pencil_snow/denoise_9.png")}
              width="64"
              height="64"
              alt="Pencil Snow Mountain hybrid"
              className="zoom-out"
              loading="lazy"
            />
            <figcaption className="dissolve">A Snowy Village</figcaption>
            <figcaption className="emerge">A Pencil</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Unconditional Unet",
    content: (
      <div>
        <h2>Unconditional Unet</h2>
        <p>
          The unet is a convolutional network designed to output images from an
          input of a images. In the downward part of the net, we run the images
          through convolution and max pooling layers to increase the perception
          of the network. Going back up, we want to recover our image, so we add
          concatenations with information from our previous layers.
        </p>
        <ImageContainer>
          <Figure>
            <Image
              src={path.join(mediaBase, "/unconditional_unet/architecture.png")}
              width="64"
              height="64"
              alt="unet architecture"
            />
            <figcaption>Unet Design</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          In a one step denoising process, we can use our unet to directly
          predict the clean image from a noisy input. To train the unconditional
          network, we fix the noise level to{" "}
          <MathJax inline={true}>{"\\(\\sigma = 0.5\\)"}</MathJax>
          and noise an image by the given formula:{" "}
          <MathJax>
            {"\\begin{equation*} x = x_{0} + \\varepsilon \\end{equation*}"}
          </MathJax>{" "}
          where{" "}
          <MathJax>
            {
              "\\begin{equation*} \\varepsilon \\sim \\mathcal{N}(0, \\sigma^{2}) \\end{equation*}"
            }
          </MathJax>{" "}
          We feed <MathJax inline={true}>{"\\(x\\)"}</MathJax> into the network
          and estimate the loss between
          <MathJax inline={true}>{"\\(\\hat{x}\\)"}</MathJax> and{" "}
          <MathJax inline={true}>{"\\(x_{0}\\)"}</MathJax>
        </p>
        <ImageContainer>
          <Figure>
            <Image
              src={path.join(mediaBase, "/unconditional_unet/loss.png")}
              width="64"
              height="64"
              alt="Unconditional Unet Loss"
              loading="lazy"
            />
            <figcaption>After 5 epochs</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          Here are some results, where the clean image is on the left, the noisy
          image is on the middle, and the predicted image is on the right of
          each figure:
        </p>
        <ImageContainer columns={2}>
          <Figure>
            <Image
              src={path.join(mediaBase, "/unconditional_unet/epoch_1.png")}
              width="64"
              height="64"
              alt="Epoch 1 Denoise"
              loading="lazy"
            />
            <figcaption>Epoch 1 Denoising</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/unconditional_unet/epoch_5.png")}
              width="64"
              height="64"
              alt="Epoch 5 Denoise"
              loading="lazy"
            />
            <figcaption>Epoch 5 Denoising</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          The unconditional unet does not do very well with higher noise levels,
          as there was no input on the amount of noise in our training. From
          left to right, the model was given images with noise levels of{" "}
          <MathJax inline={true}>{"\\(0.0, 0.2, 0.4, 0.6, 0.8, \\)"}</MathJax>{" "}
          and<MathJax inline={true}>{"\\(1.0\\)"}</MathJax>
        </p>
        <ImageContainer>
          <Figure>
            <Image
              src={path.join(mediaBase, "/unconditional_unet/sampling_1.png")}
              alt="Various noise level denoisings"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>Epoch 1 Denoising</figcaption>
          </Figure>
          <Figure>
            <Image
              src={path.join(mediaBase, "/unconditional_unet/sampling_5.png")}
              alt="Various noise level denoisings"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>Epoch 5 Denoising</figcaption>
          </Figure>
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Conditional Unet",
    content: (
      <div>
        <h2>Conditional Unet</h2>
        <p>
          In a conditional unet, more information is given to the model and
          perform the denoising iteratively for better results. We define a new
          one step noising process:{" "}
          <MathJax>
            {
              "\\begin{equation*} x_{t} = \\sqrt{1 - \\overline{\\alpha_{t}}}x_{0} + \\sqrt{\\overline{\\alpha_{t}}}\\varepsilon \\end{equation*}"
            }
          </MathJax>{" "}
          where
          <MathJax>
            {
              "\\begin{equation*} \\varepsilon \\sim \\mathcal{N}(0, I) \\end{equation*}"
            }
          </MathJax>{" "}
          We want to predict the cleaner image given a noisy image and this is
          given by some function of{" "}
          <MathJax inline={true}>{"\\(x_{t}, x_{0}\\)"}</MathJax>:
          <MathJax>
            {
              "\\begin{equation*} p(x_{t - 1} \\mid x_{t}) = \\mathcal{N}(\\mu_{t}(x_{t}, x_{0}), \\tilde{\\beta} I) \\end{equation*}"
            }
          </MathJax>{" "}
          so
          <MathJax>
            {
              "\\begin{equation*} x_{t - 1} = \\dfrac{\\sqrt{\\overline{\\alpha_{t - 1}}}\\beta_{t}}{1 - \\overline{\\alpha_{t}}}x_{0} + \\dfrac{\\sqrt{\\alpha_{t}}(1 - \\overline{\\alpha}_{t - 1})}{1 - \\overline{\\alpha}_{t}}x_{t} + \\tilde{\\beta}_{t}z, \\, \\tilde{\\beta}_{t} = \\dfrac{1 - \\overline{\\alpha}_{t - 1}}{1 - \\overline{\\alpha}_{t}}\\beta_{t} \\end{equation*}"
            }
          </MathJax>{" "}
          We define our
          <MathJax inline={true}>{"\\(\\beta_{t}\\)"}</MathJax> as linear in
          <MathJax inline={true}>
            {"\\([0, 999]\\), \\(\\overline{\\alpha}_{t} = 1 - \\beta_{t}\\)"}
          </MathJax>{" "}
          and{" "}
          <MathJax inline={true}>
            {"\\alpha_{t} = \\prod_{i = 0}^{t}\\overline{\\alpha}_{i}"}
          </MathJax>
          . This gives us a way to recover a cleaner image{" "}
          <MathJax inline={true}>{"\\(x_{t - 1}\\)"}</MathJax> in terms of the
          predicted noise
          <MathJax inline={true}>{"\\(\\hat{\\varepsilon}\\)"}</MathJax>
          and <MathJax inline={true}>{"\\(x_{t}\\)"}</MathJax>.
        </p>
        <p>
          We first update the architecture by embedding the time and label of
          the training data. This is done by running both these through a linear
          layer, gelu, then another linear layer. We do this two times and embed
          at the unflatten layer and up convolve layer:
          <MathJax>
            {"\\begin{equation*} x = c \\cdot x + t \\end{equation*}"}
          </MathJax>
          The forward process in the conditional unet is mostly the same. We add
          noise given by our new one step noising process. A mask is also
          created with a certain probability to run unconditioned predictions to
          make the model more flexible. Instead of predicting the clean image,
          the model will predict the noise and we update it based on{" "}
          <MathJax inline={true}>
            {"MSE\\((\\hat{\\varepsilon}, \\varepsilon)\\)"}
          </MathJax>
        </p>
        <ImageContainer>
          <Figure>
            <Image
              src={path.join(mediaBase, "/conditional_unet/loss.png")}
              alt="Conditional Unet Loss"
              width="64"
              height="64"
              loading="lazy"
            />
            <figcaption>After 20 Epochs</figcaption>
          </Figure>
        </ImageContainer>
        <p>
          In the sampling/denoising process, we iteratively predict the cleaner
          image given the formula for{" "}
          <MathJax inline={true}>{"\\(x_{t - 1}\\)"}</MathJax> calculated above.
          Hover over the images to see the denoising in action:
        </p>
        <ImageContainer>
          <Figure>
            <ImageContainer>
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling1.jpeg")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 1 jpeg"
                loading="lazy"
                // onMouseOver="resetSiblingGif(this)"
                className="dissolve"
              />
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling1.gif")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 1"
                loading="lazy"
                className="emerge"
              />
            </ImageContainer>
            <figcaption>Epoch 1</figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling5.jpeg")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 5 jpeg"
                loading="lazy"
                // onMouseOver="resetSiblingGif(this)"
                className="dissolve"
              />
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling5.gif")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 5"
                loading="lazy"
                className="emerge"
              />
            </ImageContainer>
            <figcaption>Epoch 5</figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling10.jpeg")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 10 jpeg"
                loading="lazy"
                // onMouseOver="resetSiblingGif(this)"
                className="dissolve"
              />
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling10.gif")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 10"
                loading="lazy"
                className="emerge"
              />
            </ImageContainer>
            <figcaption>Epoch 10</figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling15.jpeg")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 15 jpeg"
                loading="lazy"
                // onMouseOver="resetSiblingGif(this)"
                className="dissolve"
              />
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling15.gif")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 15"
                loading="lazy"
                className="emerge"
              />
            </ImageContainer>
            <figcaption>Epoch 15</figcaption>
          </Figure>
          <Figure>
            <ImageContainer>
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling20.jpeg")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 20 jpeg"
                loading="lazy"
                // onMouseOver="resetSiblingGif(this)"
                className="dissolve"
              />
              <Image
                src={path.join(mediaBase, "/conditional_unet/sampling20.gif")}
                width="64"
                height="64"
                alt="Conditional Unet Sampling 20"
                loading="lazy"
                className="emerge"
              />
            </ImageContainer>
            <figcaption>Epoch 20</figcaption>
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
        <h1>Project 5: Fun With Diffusion Models!</h1>
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
          <Sidebar ids={pageContent.map((article) => article.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}
