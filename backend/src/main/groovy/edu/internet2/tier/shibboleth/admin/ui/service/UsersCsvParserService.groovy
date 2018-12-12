package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import liquibase.util.StringUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class UsersCsvParserService {

    private static final Logger logger = LoggerFactory.getLogger(UsersCsvParserService.class)

    //TODO: Is there a better, springy way to do this?
    String getUsersCsvFilename() {
        Properties properties = new Properties()
        properties.load(getClass().classLoader.getResourceAsStream('application.properties'))
        properties.get('bootstrap.users.csv.filename')
    }

    List<User> parseUsersFromCsv() {
        def usersFilename = getUsersCsvFilename()
        def users = null
        if (StringUtils.isNotEmpty(usersFilename)) {
            InputStream inputFile = getClass().classLoader.getResourceAsStream(usersFilename)
            if (inputFile != null) {
                List<String[]> rows = inputFile.text.split('\n').collect { it.split(',') }

                rows.findAll { it.size() < 4 }.each {
                    logger.warn('Invalid entry detected in {} -> {}', usersFilename, it)
                    logger.warn('Entries are of the form: username,password,firstName,lastName[,role1,role2,...,roleN]')
                }
                users = rows.findAll { it.size() > 3 }.collect { row ->
                    new User().with {
                        username = row[0]
                        password = row[1]
                        firstName = row[2]
                        lastName = row[3]
                        roles = new HashSet<Role>()
                        (4..row.size() - 1).each { roleIndex ->
                            roles.add(new Role().with {
                                name = row[roleIndex]
                                it
                            })
                        }
                        it
                    }
                }
            } else {
                logger.error('The application.properties property [bootstrap.users.csv.filename] specifies a file [{}] that was not found.', usersFilename)
            }
        } else {
            logger.info('No bootstrap.users.csv.filename specified in application.properties.')
        }
        users ?: new ArrayList<User>()
    }
}