/* eslint-disable spellcheck/spell-checker */
/* eslint-disable max-len */

import Localize from '@locale';

import { Import, ImportInfo } from '../Import';

import importTemplate from './fixtures/ImportTx.json';

jest.mock('@services/NetworkService');

describe('Import ', () => {
    describe('Class', () => {
        it('Should set tx type if not set', () => {
            const instance = new Import();
            expect(instance.TransactionType).toBe('Import');
            expect(instance.Type).toBe('Import');
        });

        it('Should return right parsed values', () => {
            const { tx, meta } = importTemplate.RegularKey;
            const instance = new Import(tx, meta);

            expect(instance.TransactionType).toBe('Import');
            expect(instance.Type).toBe('Import');

            expect(instance.Blob).toBe(
                '7B226C6564676572223A7B226163726F6F74223A2231394337303837314142443136354331424132323830433639433137443332423838303042313035333245443338414233423331383341324137373832433446222C22636C6F7365223A3734393931393335322C22636F696E73223A223939393939393939393839393939393634222C2263726573223A31302C22666C616773223A302C22696E646578223A3130352C2270636C6F7365223A3734393931393335312C227068617368223A2235314537454336314441354530444632413442443839353633443244434534353531354435464132364334333235334341323046303134363534464442433237222C227478726F6F74223A2245393634323543334135454235453543334538353846314641393039343546433733443836384542413846373444324544324243324333334338414230414541227D2C227472616E73616374696F6E223A7B22626C6F62223A22313230303035323230303030303030303234303030303030313232303142303030303030374332303144303030303533353936383430303030303030303039383936383037333231303236393141433541453143344333333341453544463841393342444334393546304545424643364442304441374542364546383038463341464330303645334645373434373330343530323231303041453230343237354537433434314543443544414531383530454534413332364442364338443938424535343534304645304536414434374143444441443738303232303133374638424336423433453846333138344246433034324132373345464131333439373741453334433034423039313945414641453933424137383536314338313134414531323341383535364633434639313135343731313337364146423046383934463833324233443838313446353144464332413039443632434242413144464244443436393144414339364144393842393046222C226D657461223A2232303143303030303030303046384535313130303631323530303030303036383535314630393343333446433832344642323839313730333133443641314241353636464439414133393731393746354343424541383443424539433536443133423536393246413641394643384541363031384435443136353332443737393543393142464230383331333535424446444131373745383643384246393937393835464536323430303030303031323632343030303030303037373335393346344531453732323030303130303030323430303030303031333244303030303030303036323430303030303030373639434644373438313134414531323341383535364633434639313135343731313337364146423046383934463833324233443838313446353144464332413039443632434242413144464244443436393144414339364144393842393046453145314631303331303030222C2270726F6F66223A7B226368696C6472656E223A7B2230223A7B226368696C6472656E223A7B7D2C2268617368223A2241333434354643343645353432463533374645423344414336374139453536453638324546464642343034303132444236333341303443384637384135333533222C226B6579223A2230313138353231313841424344363244414534373034463334354431384144303044323146344344413338343432434546354135354130413838453336443136227D7D2C2268617368223A2245393634323543334135454235453543334538353846314641393039343546433733443836384542413846373444324544324243324333334338414230414541222C226B6579223A2230303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030227D7D2C2276616C69646174696F6E223A7B2264617461223A7B226E394B417566666D677268585736777A676B354D476945445751583961435162627A6362636159635362586677394769516E7575223A223232383030303030303132363030303030303639323932434232444337413341384239314338433145374245383234353531423730454333443438373630464530443243383732443132454538454644394643323136353231324234323137434336463943324234364639334437363241313530313730373931333536433037393241373643433134303345383337424431353046384538394438353230413334374638464632323434303545434339463046384531353031393531453745433631444135453044463241344244383935363344324443453435353135443546413236433433323533434132304630313436353446444243323737333231303242384434373943383245334637383734423239333646383837333246374141353835414539423643333241393239453445394143444232383131433839424331373634363330343430323230344336423637363342394445454437453742363545384245443538334645463039333338364646334338304235324544433936384244463331464441453035313032323036384645413442423539413545453235363836444442463337423344343934453534444245444342324545363443344639343538313232444234334335303841222C226E394C796B5577724A59354D69366477694E31686B76343466316E616251694A5354715173353144657A6262765A616D744E7259223A223232383030303030303132363030303030303639323932434232444337413341453341343235434135413641423137423531423730454333443438373630464530443243383732443132454538454644394643323136353231324234323137434336463943324234364639334437363241313530313730373931333536433037393241373643433134303345383337424431353046384538394438353230413334374638464632323434303545434339463046384531353031393531453745433631444135453044463241344244383935363344324443453435353135443546413236433433323533434132304630313436353446444243323737333231303334304237453832383032333738394246343836453445353136334644433338363346464635464246354243334246453735363543334234354142383230324630373634363330343430323230354334343043393936344232433142384441334633364437344137423934363132434144353834354139364136423146413434334635454434393046373137383032323035413832464137463042393532413739373330454637374544373535393738323846333738374136423441373942363432433045363735444234453043324337227D2C22756E6C223A7B22626C6F62223A2265794A7A5A5846315A57356A5A5349364D5377695A58687761584A6864476C76626949364E7A55774E6A67794D7A4D794C434A32595778705A47463062334A7A496A706265794A32595778705A4746306157397558334231596D7870593139725A586B694F694A4652444D79526A56424E5546474D6B49304E4552454D3055794D4551774D454D784E7A46424D446842524555344E546B344E4459335155457A516A6C454E454D78526A63354D3055344E7A5A454E6A45314E44513052544D694C434A74595735705A6D567A64434936496B704251554642515570345357557765546C6856335A4C4D46526B55476C455555524359324644537A4E7656316C53626E467164575255516A6B315547396B64466C57556B55304D30316F51584A715657566A5A3356514D3267776333424F646D6C4954585A6C63566447636E423063303178613341315432317A4D6E6C6E556E6C4B646B4A6B61324E33556C464A6145464B62574A684F455255636D7871535374325A5531314E6C684E4D6A5935524759304D6B6B3561537470526C46734D544E5A5A69745255304A4451576C435A7A4E4C53474646624338794E546C5954574A4D57476472593168764E585233646E517963544E36575464574E575A47616A5A7661475A7357474E4D5A47307861474D7A556D786A61545671596A4978643056725130395355553553646E51774C304A77516B564853444E735247684C596E5A4E61586C7655584A6C4F4735514F446443656938794D6E703653326F766447353453453146536A467A634864524D6D39794C32746854556875626D52455A45684A6353746F4E6D6C5164455579526B567161304D6966537837496E5A6862476C6B59585270623235666348566962476C6A5832746C65534936496B56454D6A4D35525445314E7A59334D6A41344E544130515445335154464251304D784F554A434D5468474F5445334F444D78526B46434E30497A526A6B7A4F4551344D6A4A464E6B4D35526A6730526A46444F5455354D534973496D3168626D6C6D5A584E30496A6F69536B464251554642536E684A5A544271626D68574D6D4E6E614646546147566F636B3148596E4E5A4B314A6C52456732644464514E55394F5A326B316332343056486835566D7459545768424D454D7A4E6B4E6E5130343062533954527A5650565664514F586330575338764D537376567A68504C7A5578576D4E504D4664795A32644D643252725933645355556C6F51557735624578614E325976633156785A303942556B786852576331564452555430393663484A4F5179394F616B5132565563346358685A526C4E4261554A574C316C52656E6C7263464A5664325234656D746F4F48557A4E6D5A305A5656754E7A4A31613074476244465A537A5642515777334B3274595930746B62545632576B645665457874546E5A6957454654555555355157564F56446448565846575356637A5A546C6C516C4E334D3345794D30466C5A48564E62574E7054567032596D7077626B704661564130566C42594E55523157566C685758427453446C35626A417A4E587072595755785433643355455A50597A6876556C45725358467A6333647A50534A395858303D222C226D616E6966657374223A224A414141414146784965313031414E735A5A476B76666E46544F2B6A6D356C7158633566687445663268683053427A703161484E77584D6837544E392B623632635A71546E67614659553574624770594843386F59754933473376776A394F57325A3967646B416E556A6659357A4F456B687133317455343333386A637955705641352F565473414E46636537756E446F2B4A65566F456866754F622F593857413344697539587A754F4434552F696B66676639535A4F6C4F47634263424A41773434504C6A482B485574456E775834356C49526D6F30783561494E464D765A7342704539517465534442584B77597A4C646E5357346531627332316F2B49494C4A4969494B552F2B315578783046527051624D44413D3D222C227075626C69635F6B6579223A22454437344434303336433635393141344244463943353443454641333942393936413544434535463836443131464441313837343438314345394435413143444331222C227369676E6174757265223A223841444644373231393246313436394444313432314632423542323831333243303133363446384636453232333334363634304144463335464546363433343045393145464332413543373743333835363044423037443142303041313039303244354545303832433843314634363338413238384234353843343643333045222C2276657273696F6E223A317D7D7D',
            );
            expect(instance.Issuer).toBe('rrrrrrrrrrrrrrrrrrrrrholvtp');
        });
    });

    describe('Info', () => {
        describe('getDescription()', () => {
            it('should return the expected description', () => {
                const { tx, meta } = importTemplate.RegularKey;
                const instance = new Import(tx, meta);

                const expectedDescription = `${Localize.t('events.importTransactionExplain')}\n${Localize.t(
                    'events.theIssuerIs',
                    { issuer: instance.Issuer },
                )}`;

                expect(ImportInfo.getDescription(instance)).toEqual(expectedDescription);
            });
        });

        describe('getLabel()', () => {
            it('should return the expected label', () => {
                expect(ImportInfo.getLabel()).toEqual(Localize.t('events.import'));
            });
        });
    });

    describe('Validation', () => {});
});
