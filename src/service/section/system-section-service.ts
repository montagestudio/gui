import {AbstractSectionService} from './abstract-section-service-ng';
import {SystemRepository} from '../../repository/system-repository';
import {NtpServerRepository} from '../../repository/ntp-server-repository';
import {VmRepository} from '../../repository/vm-repository';
import {ContainerRepository} from '../../repository/container-repository';
import {NetworkRepository} from '../../repository/network-repository';
import {CryptoCertificateRepository} from '../../repository/crypto-certificate-repository';
import Promise = require("bluebird");
import {TunableRepository} from '../../repository/tunable-repository';
import {VolumeRepository} from '../../repository/volume-repository';
import {ShareRepository} from '../../repository/share-repository';
import {PeerRepository} from '../../repository/peer-repository';
import {ReplicationRepository} from '../../repository/replication-repository';
import {DiskRepository} from '../../repository/disk-repository';
import {BootPoolRepository} from "../../repository/boot-pool-repository";
import {ModelEventName} from "../../model-event-name";
import {DataObjectChangeService} from "../data-object-change-service";
import * as Immutable from "immutable";
import * as _ from "lodash";

export class SystemSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private ntpServerRepository: NtpServerRepository;
    private vmRepository: VmRepository;
    private containerRepository: ContainerRepository;
    private networkRepository: NetworkRepository;
    private cryptoCertificateRepository: CryptoCertificateRepository;
    private tunableRepository: TunableRepository;
    private volumeRepository: VolumeRepository;
    private shareRepository: ShareRepository;
    private peerRepository: PeerRepository;
    private replicationRepository: ReplicationRepository;
    private diskRepository: DiskRepository;
    private bootPoolRepository: BootPoolRepository;
    private bootEnvironments: Array<any> = [];
    private dataObjectChangeService: DataObjectChangeService;

    public readonly SELF_SIGNED = CryptoCertificateRepository.SELF_SIGNED;
    public readonly CREATION = CryptoCertificateRepository.CREATION;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.ntpServerRepository = NtpServerRepository.getInstance();
        this.vmRepository = VmRepository.getInstance();
        this.containerRepository = ContainerRepository.instance;
        this.networkRepository = NetworkRepository.getInstance();
        this.cryptoCertificateRepository = CryptoCertificateRepository.getInstance();
        this.tunableRepository = TunableRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.shareRepository = ShareRepository.getInstance();
        this.peerRepository = PeerRepository.getInstance();
        this.replicationRepository = ReplicationRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
        this.bootPoolRepository = BootPoolRepository.getInstance();
        this.dataObjectChangeService = new DataObjectChangeService();

        this.eventDispatcherService.addEventListener(
            ModelEventName.BootEnvironment.listChange,
            this.handleBootPoolChange.bind(this)
        );
    }

    protected loadEntries() {
        return this.systemRepository.listSystemSections();
    }

    public getTimezoneOptions() {
        return this.systemRepository.getTimezones();
    }

    public getKeymapOptions() {
        return this.systemRepository.getKeymaps();
    }

    public getSystemGeneral() {
        return this.systemRepository.getGeneral();
    }

    public getSystemTime() {
        return this.systemRepository.getTime();
    }

    public getSystemVersion() {
        return this.systemRepository.getVersion();
    }

    public getSystemDataset() {
        return this.systemRepository.getDataset();
    }

    public getSystemAdvanced() {
        return this.systemRepository.getAdvanced();
    }

    public listNtpServers() {
        return this.ntpServerRepository.listNtpServers();
    }

    public saveNtpServer(ntpServer) {
        return this.ntpServerRepository.saveNtpServer(ntpServer);
    }

    public listVms() {
        return this.vmRepository.listVms();
    }

    public listContainers() {
        return this.containerRepository.listDockerContainers();
    }

    public listNetworkInterfaces() {
        return this.networkRepository.listNetworkInterfaces();
    }

    public listCertificates() {
        return this.cryptoCertificateRepository.listCryptoCertificates();
    }

    public listCountryCodes() {
        return this.cryptoCertificateRepository.listCountryCodes();
    }

    public listTunables() {
        return this.tunableRepository.listTunables();
    }

    public listBootEnvironments () {
        return this.bootPoolRepository.listBootEnvironments().then((bootEnvironments) => {
            return _.assign(this.bootEnvironments, bootEnvironments);
        });
    }

    public getBootVolumeConfig () {
        return this.bootPoolRepository.getBootPoolConfig().then((bootVolumeConfig) => {
            return (bootVolumeConfig as any).data;
        });
    }

    private handleBootPoolChange (bootEnvironments: Immutable.Map<string, Immutable.Map<string, any>>) {
        this.dataObjectChangeService.handleDataChange(this.bootEnvironments, bootEnvironments);
    }

    public saveCertificate(certificate: any) {
        return this.cryptoCertificateRepository.saveCryptoCertificate(certificate);
    }

    public listVolumes() {
        return this.volumeRepository.listVolumes();
    }

    public listDisks() {
        return this.diskRepository.listDisks();
    }

    public listVolumeSnapshots() {
        return this.volumeRepository.listSnapshots();
    }

    public listVolumeDatasets() {
        return this.volumeRepository.listDatasets();
    }

    public listShares() {
        return this.shareRepository.listShares();
    }

    public listPeers() {
        return this.peerRepository.listPeers();
    }

    public listReplications() {
        return this.replicationRepository.listReplications();
    }

    protected loadExtraEntries() {
        return undefined;
    }

    protected loadSettings() {
        return undefined;
    }

    protected loadOverview() {
        return undefined;
    }
}