#include <eosiolib/eosio.hpp>

using namespace eosio;

// replace the contract class name when you start your own project
class notechain : public eosio::contract {

  // the contract is almost empty except only having the "update" action and a require_auth function inside.
  // demux will check all valid ( authorized ) blocks and fetch the payloads of this action hence we could handle the state in demux ( backend ).
  public:
    using contract::contract;

    /// @abi action
    void update( account_name _user, std::string _note ) {
      // only authorize the signed transaction with correct user and its signature,
      // otherwise, reject the transaction
      require_auth( _user );

    }

};

// specify the contract name, and export a public action: update
EOSIO_ABI( notechain, (update) )
