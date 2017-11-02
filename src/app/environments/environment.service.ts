import { Injectable } from '@angular/core';
import { Services, Environment } from '@jatahworx/bhive-core';


@Injectable()
export class EnvironmentService {

  environmentService = new Services.EnvironmentService();
  constructor() { }
  createEnvironment(appName, environmentDetails, operationType) {
    return new Promise((resolve, reject) => {
      let environment = new Environment(environmentDetails.name);
      this.environmentService.put(appName, environment, operationType).then(result => {
        if (result.httpStatus == 201) {
          resolve(environment);
        }
      }).catch(error => {
        console.error(error);
      })
    })
  }
  updateEnvironment(appName, environmentDetails, operationType) {
    return new Promise((resolve, reject) => {
      this.environmentService.put(appName, environmentDetails, operationType).then(result => {
        if (result.httpStatus == 201) {
          resolve(environmentDetails);
        }
      }).catch(error => {
        console.error(error);
      })
    })
  }
  removeEnvironment(appName, environmentName) {
    return new Promise((resolve, reject) => {
      this.environmentService.remove(appName, environmentName).then(result => {
        resolve(environmentName);
      }).catch(error => {
        console.error(error);
        // reject(error);
      })
    })
  }
}
