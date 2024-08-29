import { envs } from "../src/shared/helpers/envs/envs";

let stage: string;

if (envs.GITHUB_REF.includes('prod')) {
  stage = 'PROD';
} else if (envs.GITHUB_REF.includes('homolog')) {
  stage = 'HOMOLOG';
} else if (envs.GITHUB_REF.includes('dev')) {
  stage = 'DEV';
} else {
  stage = 'TEST';
}

export { stage };