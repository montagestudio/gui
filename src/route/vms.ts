import {ModelDescriptorService} from "../service/model-descriptor-service";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {AbstractRoute} from "./abstract-route";
import {Model} from "../model";
import _ = require("lodash");
import Promise = require("bluebird");
import {VmRepository} from '../repository/vm-repository';

export class VmsRoute extends AbstractRoute {
    private static instance: VmsRoute;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private vmRepository: VmRepository) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!VmsRoute.instance) {
            VmsRoute.instance = new VmsRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                VmRepository.getInstance()
            );
        }
        return VmsRoute.instance;
    }

    public get(vmId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Vm,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm/_/' + encodeURIComponent(vmId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
           context.object = _.find(parentContext.object.entries, {id: vmId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public create(stack: Array<any>) {
        let self = this,
            objectType = Model.Vm,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVm(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vm, uiDescriptor) {
            context.object = vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getReadme(stack: Array<any>) {
        let self = this,
            objectType = Model.VmReadme,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/readme'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = parentContext.object._readme;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listDevices(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/devices'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = parentContext.object._nonVolumeDevices;
            context.object._vm = parentContext.object;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getDevice(deviceId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-device/_/' + encodeURIComponent(deviceId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {id: deviceId});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewDeviceType(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(this.vmRepository.DEVICE_TYPE), (type) => this.vmRepository.getNewVmDeviceForType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmdevices, uiDescriptor) {
            context.object = _.compact(vmdevices);
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createDevice(deviceType: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDevice,
            columnIndex = 3,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + encodeURIComponent(deviceType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {_tmpId: deviceType});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listVolumes(stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/volumes'
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.reject(parentContext.object._volumeDevices, {properties: {type: 'NFS'}});
            context.object._vm = parentContext.object;
            context.object._objectType = objectType;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getVolume(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-volume/_/' + encodeURIComponent(volumeId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {id: volumeId});
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createVolume(stack: Array<any>) {
        let self = this,
            objectType = Model.VmVolume,
            columnIndex = 3,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            this.vmRepository.getNewVmVolume(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmvolume, uiDescriptor) {
            context.object = vmvolume;
            context.object._vm = parentContext.object._vm;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public listDatastores(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-datastore'
            };
        return Promise.all([
            this.vmRepository.listDatastores(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(datastores, uiDescriptor) {
            datastores._objectType = objectType;
            context.object = datastores;
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public getDatastore(datastoreId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/vm-datastore/_/' + encodeURIComponent(datastoreId)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {id: datastoreId});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public selectNewDatastoreType(stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(this.vmRepository.DATASTORE_TYPE), (type) => this.vmRepository.getNewVmDatastoreForType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(vmdatastores, uiDescriptor) {
            context.object = _.compact(vmdatastores);
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

    public createDatastore(datastoreType: string, stack: Array<any>) {
        let self = this,
            objectType = Model.VmDatastore,
            columnIndex = 2,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + encodeURIComponent(datastoreType)
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            context.object = _.find(parentContext.object, {_tmpId: datastoreType});
            context.userInterfaceDescriptor = uiDescriptor;

            return self.updateStackWithContext(stack, context);
        });
    }

}