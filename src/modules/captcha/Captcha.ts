import { InterfaceCaptchaConfiguration } from "App/modules/captcha/InterfaceCaptchaConfiguration";
import CaptchaConfiguration from "App/modules/captcha/configuration/Configuration.json";

export class Captcha {
  private static captchaConfiguration: InterfaceCaptchaConfiguration = CaptchaConfiguration
  public static getConfiguration() {
    return this.captchaConfiguration
  }
}